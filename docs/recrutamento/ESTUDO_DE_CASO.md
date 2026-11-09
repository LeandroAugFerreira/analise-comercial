# Análise Comercial — estudo de caso para Analista de Dados/BI Júnior

## Pergunta analítica

Como avaliar vendas, faturamento calculado, margem e devoluções por ano, produto, região e canal, **sem confundir unidade vendida com transação**, nem tratar valor de devoluções como estorno financeiro comprovado?

O cenário usa planilhas de curso e modelo Power BI preservado, reconhecidos pelo autor como **fictícios/didáticos**. Não se trata de clientes atendidos pelo autor nem performance comercial de operação própria.

## Fontes e solução

Os originais PBIX/XLSX ficam em [originais](../../originais), com hashes em [SHA256.json](../../originais/SHA256.json). Power Query M transforma vendas, produtos, lojas, clientes e devoluções; DAX declara indicadores. Preparação anterior extraiu snapshot JSON offline. Uma interface web HTML/SVG/JavaScript apresenta gráficos e filtros com **fórmulas próprias**.

[Arquitetura](ARQUITETURA.md) · [Modelo DAX](../../modelo/dax_measures.json) · [App web completo](https://leandroaugferreira.github.io/dashboards/comercial/).

## Resultado 1 — visão geral do dataset didático

| KPI | Resultado e interpretação |
| --- | --- |
| Registros fVendas | 56.046 linhas |
| Total Vendas | 84.174 unidades vendidas |
| Faturamento Total | 15.226.080,56 de valor nominal do modelo |
| Lucro Total | 9.842.627,604, definido por 90% do preço menos custo |
| Margem | 64,64% pela fórmula específica do modelo |
| Registros fDevoluções | 1.809 linhas |
| Total Devoluções | 1.828 unidades |
| Taxa de devoluções | 2,17%, unidades devolvidas / vendidas |
| Faturamento Perdido | 433.032,87 de valor estimado pelo preço cadastrado |

A unidade monetária não foi formalmente homologada; evitar rotular como R$ sem fonte. Esses valores não representam receita bancária realizada, lucro líquido nem reembolso efetivo.

## Resultado 2 — comparar os anos sem inferir causalidade

| Ano do snapshot | Unidades vendidas | Faturamento nominal | Lucro calculado | Unidades devolvidas |
| --- | ---: | ---: | ---: | ---: |
| 2020 | 2.630 | 2.183.760,41 | 1.414.636,269 | 86 |
| 2021 | 36.230 | 5.982.860,68 | 3.872.367,712 | 770 |
| 2022 | 45.314 | 7.059.459,47 | 4.555.623,623 | 972 |
| Total | 84.174 | 15.226.080,56 | 9.842.627,604 | 1.828 |

A diferença expressiva entre 2020 e 2021 pode refletir cobertura desigual e mix de produtos. Um ano com mais unidades não prova eficiência, estratégia ou crescimento orgânico. Só há retrato descritivo do conjunto didático.

## Resultado 3 — canais e produtos

- Canal `Online`: 14.288 unidades vendidas, 2.499.053,43 de faturamento, 318 devoluções.
- Tipo `Notebook`: 6.262 unidades e 7.469.356,74 de faturamento, 193 devoluções.
- Os recortes de canal e tipo são **filtros distintos**, não categorias mutuamente exclusivas do total.
- Taxas precisam sempre indicar denominador e período: por exemplo, 193/6.262 em Notebook.

## Resultado 4 — qualidade e metodologia

Todos os cinco relacionamentos declarados (vendas→clientes/lojas/produtos; devoluções→produtos/lojas) passaram na cobertura de chaves no snapshot: **zero órfãos e zero duplicatas de chave de dimensão**. Quantidades de venda e devolução não têm valores zero/negativos no diagnóstico executado.

Essa verificação não significa ausência de outros erros de cadastro ou conformidade financeira. O modelo contém datas de venda e devolução **distintas**: a taxa por ano usa eventos ocorridos no ano, **não necessariamente os retornos das vendas feitas naquele ano**.

## Decisões técnicas demonstráveis

1. Preservar binários originais com hash e não atualizar dados acidentalmente.
2. Definir KPIs e unidades antes de comparar gráficos.
3. Reconciliar medidas por ano, canal e produto contra valores de referência independentes.
4. Testar ausência de dados como `null` para taxa/margem, não forçar 0%.
5. Auditar M:1, positividade e cobertura de chaves sem divulgar linhas de clientes.
6. Distinguir medidas DAX do motor JavaScript da apresentação.

## Evidências e limites

[CI com 32 testes aprovados](https://github.com/LeandroAugFerreira/analise-comercial/actions/runs/42540265849). O Power BI Desktop e as consultas Power Query não foram reexecutados nesta revisão; não há SQL novo, refresh, integração ERP, vendas reais ou ganhos financeiros comprovados.

[15 perguntas técnicas](ENTREVISTA_TECNICA.md) · [Roteiro 3 minutos](ROTEIRO_DEMO.md) · [Qualidade](QUALIDADE_DADOS.md).
