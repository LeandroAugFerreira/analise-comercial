# Análise Comercial — 15 perguntas técnicas para Dados/BI

Questões e respostas fundamentadas no repositório. Leia e saiba explicar DAX/Power Query, separando sua contribuição, a origem didática e eventual apoio de IA. Não invente métricas empresariais.

## 1. Qual pergunta orienta o projeto?
Como comparar vendas, faturamento calculado, margem e devoluções por tempo, produto, loja e canal preservando o contexto de filtros e a granularidade das tabelas?

## 2. Qual a stack utilizada?
Power BI/PBIX original, Power Query (M), DAX, Excel, snapshot JSON exportado offline e dashboard complementar em HTML/SVG/JavaScript; Node.js executa testes. O navegador **não interpreta DAX**. [Arquitetura](ARQUITETURA.md).

## 3. O que significa “Total Vendas”?
Soma de `fVendas[Qtd Vendida]`: 84.174 unidades, e não 56.046 pedidos/transações. Linhas da fato não são necessariamente pedidos distintos. [DAX](../../modelo/dax_measures.json).

## 4. Como se calcula “Faturamento Total”?
`SUMX(fVendas, Qtd Vendida × RELATED(dProdutos[Preço Unitario]))`. Resultado 15.226.080,56 unidades monetárias do dataset. [Modelo JS](../../web/model.mjs).

## 5. Por que não chama o “Lucro Total” de lucro líquido?
A regra do exercício é `Qtd × (Preço × 0,9 − Custo)`. Não inclui todas as despesas ou reconciliação bancária. Dá 9.842.627,604 na base. [DAX](../../modelo/dax_measures.json).

## 6. Como a margem é definida?
`Lucro Total / Faturamento Total`, aproximadamente 64,64%. Não é margem EBITDA nem resultado contábil. Em recorte sem vendas, a taxa deve ser ausente, não zero.

## 7. Qual a diferença entre unidades e registros de devolução?
Há 1.809 linhas de devolução, correspondendo a 1.828 unidades devolvidas. `Total Devoluções` soma a coluna de quantidade.

## 8. Como calcula a taxa de devolução?
`Total Devoluções / Total Vendas`: cerca de 2,17% na base inteira. O numerador segue data de devolução e denominador a data de venda no modelo web; por ano não é taxa de coorte de vendas sem vínculo explícito.

## 9. “Faturamento Perdido” é dinheiro estornado?
**Não comprovado.** Soma `Qtd Devolvida × Preço Unitario` por produto. É valor nominal de itens devolvidos, aproximadamente 433.032,87, não comprovante de estorno ou perda líquida.

## 10. Como foi verificado 2021?
Os testes com referências independentes encontraram 36.230 unidades, faturamento 5.982.860,68 e lucro calculado 3.872.367,712, correspondentes à captura didática do projeto. [Evidências](EVIDENCIAS.md).

## 11. O que há nos relacionamentos?
Cinco relações ativas M:1 declaradas: vendas→cliente/loja/produto, devoluções→produto/loja. O calendário filtra por datas próprias na camada web. [relationships.json](../../modelo/relationships.json).

## 12. Qual descoberta de qualidade houve?
Nenhuma chave órfã nas cinco relações examinadas e nenhuma duplicidade de chave no lado da dimensão; quantidades positivas/numericamente válidas em ambas as fatos. Isso não é auditoria completa das planilhas. [Qualidade](QUALIDADE_DADOS.md).

## 13. O aumento 2020→2021 prova crescimento real?
Não. A base didática tem 2.630 versus 36.230 unidades; mix, período, cobertura e origem podem variar. Percentual nominal alto não explica causalidade, estratégia ou resultado de empresa.

## 14. Como garantiu que a web mantém as fórmulas?
Testes Node conferem arquivos/hashes, contextos independentes `golden`, cálculos reimplementados, particionamento e integridade. **32 testes passaram**, mas não houve execução do motor DAX em Power BI Desktop nesta revisão.

## 15. Qual seria o próximo desenvolvimento de maior impacto?
Dicionário de KPIs, taxa de devolução por coorte se houver chave de venda↔devolução, testes browser, validação de preços/unidades, parametrização de consultas M e comparação com DAX no Desktop. Não corrigir dados/modelo sem versão e homologação.

---

## Exercício de entrevista

Explique a cadeia `Excel → Power Query → modelo DAX → exportação JSON → cálculo JS → visualização`. Reconcilie 84.174 unidades, 56.046 linhas, 1.828 devolvidas e 2,17% de taxa. Mostre por que `Lucro Total` inclui `0,9` e por que devoluções de um ano não devem ser tratadas automaticamente como devoluções **das vendas daquele ano**.

Não alegar clientes, receita empresarial, lucro líquido, redução de perdas, certificação financeira nem Power BI Desktop testado nesta revisão.
