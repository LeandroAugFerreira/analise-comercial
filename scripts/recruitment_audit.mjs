// Auditoria somente agregada de modelo comercial didático.
// Nunca grava chaves, nomes, registros de vendas, clientes ou lojas no relatório.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const read=path=>JSON.parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const tables=read('web/data.json').tables;
const relationships=read('modelo/relationships.json');
const sales=tables.fVendas,returns=tables['fDevoluções'];
const products=new Map(tables.dProdutos.map(r=>[String(r.SKU),r]));
const sum=(rows,fn)=>rows.reduce((v,r)=>v+fn(r),0);
const round=v=>Number(v.toFixed(3));
const diagnostics=relationships.map(rel=>{
  const dimension=tables[rel.ToTableName],fact=tables[rel.FromTableName];
  const keys=new Set(dimension.map(row=>String(row[rel.ToColumnName])));
  const unmatched=fact.filter(row=>!keys.has(String(row[rel.FromColumnName])));
  const seen=new Set();
  let duplicates=0;
  for(const row of dimension){const key=String(row[rel.ToColumnName]);if(seen.has(key))duplicates++;else seen.add(key);}
  const unmatchedQuantity=rel.FromTableName==='fVendas'
    ?sum(unmatched,row=>Number(row['Qtd Vendida'])||0)
    :sum(unmatched,row=>Number(row['Qtd Devolvida'])||0);
  return {
    fact:rel.FromTableName,dimension:rel.ToTableName,
    fact_rows:fact.length,dimension_rows:dimension.length,
    dimension_duplicate_keys:duplicates,
    without_dimension_match:unmatched.length,
    unmatched_units:unmatchedQuantity
  };
});
const countInvalid=(rows,key)=>({
  zero_or_negative:rows.filter(r=>!(Number(r[key])>0)).length,
  missing_or_nonfinite:rows.filter(r=>!Number.isFinite(Number(r[key]))).length
});
const result={
  basis:'Fontes didáticas exportadas do PBIX, sem atualização automática',
  data_snapshot_only:true,
  fact_rows:{sales:sales.length,returns:returns.length},
  totals:{
    units_sold:sum(sales,r=>Number(r['Qtd Vendida'])||0),
    units_returned:sum(returns,r=>Number(r['Qtd Devolvida'])||0),
    gross_sales_by_catalogue:round(sum(sales,r=>Number(r['Qtd Vendida'])*(Number(products.get(String(r.SKU))?.['Preço Unitario'])||0))),
    estimated_returned_value_by_catalogue:round(sum(returns,r=>Number(r['Qtd Devolvida'])*(Number(products.get(String(r.SKU))?.['Preço Unitario'])||0))),
  },
  quality:{
    sales_quantity:countInvalid(sales,'Qtd Vendida'),
    returned_quantity:countInvalid(returns,'Qtd Devolvida'),
    relationships:diagnostics
  }
};
mkdirSync(new URL('../reports/',import.meta.url),{recursive:true});
writeFileSync(new URL('../reports/quality-summary.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
