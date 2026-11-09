# Análise Comercial — diagnóstico de qualidade do snapshot

**Referência:** [CI #42540265849](https://github.com/LeandroAugFerreira/analise-comercial/actions/runs/42540265849). A base é **didática e estática**. O script [recruitment_audit.mjs](../../scripts/recruitment_audit.mjs) lê os dados locais e produz apenas resultados agregados em `reports/quality-summary.json`, sem nomes ou linhas individuais.

## O que foi medido efetivamente

| Relação ativa extraída | Fato | Dimensão | Linhas sem correspondência | Chaves duplicadas na dimensão |
| --- | --- | --- | ---: | ---: |
| Cliente | fVendas | dClientes | 0 | 0 |
| Loja da venda | fVendas | dLojas | 0 | 0 |
| Produto devolvido | fDevoluções | dProdutos | 0 | 0 |
| Loja da devolução | fDevoluções | dLojas | 0 | 0 |
| Produto vendido | fVendas | dProdutos | 0 | 0 |

- **56.046 registros** de vendas, **1.809 registros** de devoluções.
- **84.174 unidades vendidas**, **1.828 unidades devolvidas**.
- Zero registros de venda com `Qtd Vendida` zero/negativa ou não numérica, segundo a auditoria.
- Zero registros de devolução com `Qtd Devolvida` zero/negativa ou não numérica.
- Não houve reescrita de nenhum cadastro, venda ou devolução.

**Limite:** cinco relações presentes em `modelo/relationships.json` são o escopo deste teste. Não deduzir que outros campos, dados pessoais, preços, transações ou tributos foram auditados.

## Regras semânticas que exigem cuidado

### Unidades vs registros

`Total Vendas` é soma de `Qtd Vendida` (84.174), não número de pedidos/linhas (56.046). Devoluções seguem o mesmo princípio: 1.828 unidades, 1.809 linhas. Confundir esses níveis produz taxas incorretas.

### Margem não é lucro líquido

`Lucro Total` aplica um fator didático `0.9` ao preço antes de subtrair custo. `% Margem de Lucro` divide esse lucro calculado pelo faturamento nominal. Não há prova de impostos, frete, despesas, impostos retidos ou lucro líquido empresarial.

### Valor de devolução não é prejuízo bancário

`Faturamento Perdido` usa quantidades devolvidas vezes preço de cadastro, sem identificar pagamento, estorno, taxas ou perda líquida. Isso é uma métrica de **valor nominal de itens devolvidos**, não um fluxo de caixa comprovado.

### Atenção ao recorte temporal

Na interface web, os filtros de `dCalendario` se aplicam à `Data da Venda` para `fVendas` e à `Data Devolução` para `fDevoluções`. Dividir devoluções do ano por vendas do ano **não necessariamente calcula o percentual de itens vendidos naquele ano que foram devolvidos**. Para análise por coorte, seria necessário ligar cada devolução à sua venda de origem e definir uma janela de devolução. A versão atual não comprova esse vínculo.

### Comparação entre 2020, 2021 e 2022

A base contém 2.630 unidades em 2020, 36.230 em 2021 e 45.314 em 2022. O aumento absoluto ou percentual isolado não comprova crescimento orgânico: os períodos podem ter coberturas, mix e cadastros diferentes. Comparabilidade deve ser investigada antes de decisão comercial.

## Melhorias priorizadas

1. Criar **dicionário de métricas** (unidade monetária, evento, período, fórmula, fonte e limitações).
2. Diferenciar `valor devolvido` de `prejuízo efetivo` e `Lucro Total` didático de lucro líquido em títulos/documentação.
3. Introduzir aviso explicativo sobre **coortes e datas de devolução**; não inventar link inexistente entre nota e venda.
4. Adicionar QA por nulos, valores extremos, preços inválidos, duplicidade de venda e distribuição por período em preparação offline.
5. Se houver atualização do exercício, revalidar o PBIX/Power Query e criar novos snapshots aprovados, preservando versões anteriores.
6. Implantar testes browser/a11y sem publicar dados empresariais reais.

## Reproduzir

~~~sh
node --test tests/*.test.mjs
node scripts/recruitment_audit.mjs
~~~

O relatório é agregado e fica ignorado no Git, além de disponível temporariamente como artefato no Actions. Originais PBIX/XLSX e snapshot não são alterados.

[Auditoria](AUDITORIA.md) · [Estudo de caso](ESTUDO_DE_CASO.md) · [Plano](PLANO_DE_MELHORIAS.md).
