import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createModel} from '../web/model.mjs';

const read = path => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const data=read('../web/data.json'), golden=read('./golden.json'), config=read('../web/config.json');
const relations=read('../modelo/relationships.json'), dax=read('../modelo/dax_measures.json');
const model=createModel(data,'comercial'), tables=data.tables;
const sales=tables.fVendas, returns=tables['fDevoluções'];
const products=new Map(tables.dProdutos.map(p=>[p.SKU,p]));
const value=(name,ctx={})=>model.measure(name,ctx);
const near=(a,b,abs=1e-6)=>assert.ok(Math.abs(a-b)<=Math.max(abs,Math.abs(b)*1e-11),String(a)+' difere de '+String(b));
const ctxYear=y=>({'dCalendario|Ano':y});
const sumMetric=(metric,periods)=>periods.reduce((s,ctx)=>s+value(metric,ctx),0);

test('escopo: dados didáticos comerciais, três páginas e contagens da fato',()=>{
 assert.equal(golden.kind,'comercial');
 assert.equal(config.kind,'comercial');
 assert.equal(sales.length,56046);
 assert.equal(returns.length,1809);
 assert.equal(tables.dClientes.length,18148);
 assert.equal(tables.dLojas.length,306);
 assert.equal(tables.dProdutos.length,293);
 assert.deepEqual(config.pages.map(x=>x.title),['Geral','Indicadores','Devoluções']);
});

test('total vendas é quantidade de unidades, não quantidade de transações',()=>{
 const independent=sales.reduce((s,r)=>s+r['Qtd Vendida'],0);
 assert.equal(independent,84174);
 assert.equal(value('Total Vendas'),independent);
 assert.notEqual(value('Total Vendas'),sales.length);
});

test('faturamento é preço do cadastro vezes quantidade vendida',()=>{
 const independent=sales.reduce((s,r)=>s+r['Qtd Vendida']*(products.get(r.SKU)?.['Preço Unitario']||0),0);
 near(independent,15226080.56);
 near(value('Faturamento Total'),independent);
});

test('Lucro Total usa 90% do preço menos custo por unidade, conforme DAX original',()=>{
 const independent=sales.reduce((s,r)=>{
  const p=products.get(r.SKU)||{};
  return s+r['Qtd Vendida']*((p['Preço Unitario']||0)*0.9-(p['Custo Unitario']||0));
 },0);
 near(value('Lucro Total'),independent);
 near(independent,9842627.604);
 assert.match(dax.find(m=>m.Name==='Lucro Total').Expression,/0\.9/);
});

test('margem segue Lucro Total/Faturamento, não receita menos devoluções',()=>{
 near(value('% Margem de Lucro'),value('Lucro Total')/value('Faturamento Total'));
 near(value('% Margem de Lucro'),0.6464321244862768);
});

test('devoluções são unidades devolvidas e não linhas da fato de devolução',()=>{
 const quantity=returns.reduce((s,r)=>s+r['Qtd Devolvida'],0);
 assert.equal(quantity,1828);
 assert.equal(value('Total Devoluções'),quantity);
 assert.notEqual(quantity,returns.length);
 near(value('% Devoluções'),quantity/value('Total Vendas'));
});

test('Faturamento Perdido é preço vezes devolução, sem prova de estorno bancário',()=>{
 const independent=returns.reduce((s,r)=>s+r['Qtd Devolvida']*(products.get(r.SKU)?.['Preço Unitario']||0),0);
 near(independent,433032.87);
 near(value('Faturamento Perdido'),independent);
 near(value('% Fat Perdido'),independent/value('Faturamento Total'));
});

test('partição por 2020, 2021 e 2022 recompõe unidades, faturamento, lucro e devoluções',()=>{
 const partitions=[2020,2021,2022].map(ctxYear);
 for(const metric of ['Total Vendas','Faturamento Total','Lucro Total','Total Devoluções','Faturamento Perdido']){
  near(sumMetric(metric,partitions),value(metric));
 }
 assert.equal(value('Total Vendas',ctxYear(2021)),36230);
});

test('2021 é reconciliável à captura didática, sem afirmar faturamento empresarial',()=>{
 const c=ctxYear(2021);
 near(value('Faturamento Total',c),5982860.68);
 near(value('Lucro Total',c),3872367.712);
 assert.equal(value('Total Vendas',c),36230);
});

test('crescimento de unidades 2021 contra 2020 é cálculo nominal, sem causalidade',()=>{
 const actual=(36230-2630)/2630;
 near(actual,12.775665399239544,1e-9);
 near(value('% Crescimento Vendas YoY',ctxYear(2021)),actual,1e-9);
});

test('filtro de loja Online mantém denominador global e reconcilia unidades',()=>{
 assert.equal(value('Vendas Online'),14288);
 near(value('% Vendas Online'),14288/84174);
 assert.equal(value('Total Vendas',{'dLojas|Tipo':'Online'}),14288);
});

test('subconjunto Notebook difere do total e preserva métricas dentro dele',()=>{
 const c={'dProdutos|Tipo do Produto':'Notebook'};
 assert.equal(value('Total Vendas',c),6262);
 near(value('Faturamento Total',c),7469356.74);
 near(value('% Devoluções',c),193/6262);
});

test('2021/julho é subconjunto consistente de 2021',()=>{
 const c={...ctxYear(2021),'dCalendario|Mês':'julho'};
 assert.equal(value('Total Vendas',c),1954);
 near(value('Faturamento Total',c),484413.87);
 assert.ok(value('Total Vendas',c)<=value('Total Vendas',ctxYear(2021)));
});

test('sem dados: percentuais são null e não 0% inventado',()=>{
 const c=ctxYear(1999);
 assert.equal(value('Total Vendas',c),0);
 assert.equal(value('Faturamento Total',c),0);
 assert.equal(value('Total Devoluções',c),0);
 assert.equal(value('% Margem de Lucro',c),null);
 assert.equal(value('% Devoluções',c),null);
 assert.equal(value('% Fat Perdido',c),null);
});

test('parâmetro desconectado não altera unidades faturadas',()=>{
 assert.equal(value('Total Vendas',{'Parâmetro|Parâmetro':'Total Vendas'}),value('Total Vendas'));
});

test('cada relacionamento extraído possui fato e dimensão com as colunas declaradas',()=>{
 for(const rel of relations){
  assert.equal(rel.Cardinality,'M:1');
  const fact=tables[rel.FromTableName], dimension=tables[rel.ToTableName];
  assert.ok(fact?.length>0 && dimension?.length>0,rel.FromTableName+'→'+rel.ToTableName);
  assert.ok(Object.hasOwn(fact[0],rel.FromColumnName),rel.FromColumnName);
  assert.ok(Object.hasOwn(dimension[0],rel.ToColumnName),rel.ToColumnName);
 }
});

test('não se inventa KPI que não existe na camada JavaScript',()=>{
 assert.equal(value('Economia Real Obtida'),null);
});
