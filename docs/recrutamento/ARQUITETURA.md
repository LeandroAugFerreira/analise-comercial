# Arquitetura verificável — Análise Comercial

## Fluxo de preparação e apresentação

~~~mermaid
flowchart LR
  XLS[Planilhas Excel didáticas] --> M[Consultas Power Query M]
  M --> P[PBIX: modelo dimensional e medidas DAX]
  P --> E[Exportação offline PBIXRay - preparação anterior]
  E --> SNAP[web/data.json - snapshot estático]
  E --> META[modelo/: DAX, relações, layout e esquema]
  SNAP --> JS[web/model.mjs - regras JavaScript]
  JS --> UI[web/app.mjs + SVG/HTML]
  UI --> WEB[GitHub Pages - dashboard interativo]
  SNAP --> QA[Node Test Runner: 32 testes]
  META --> QA
  GOLD[tests/golden.json - referências independentes] --> QA
  ORIG[originais/SHA256.json] --> QA
  QA --> AGG[Diagnóstico agregado / CI]
~~~

Não há backend de negócio, refresh automático ou Power BI Embedded nesta aplicação web. Os arquivos PBIX/XLSX continuam disponíveis para inspeção independente.

## Fatos e dimensões efetivamente relacionadas

~~~mermaid
flowchart TB
  DV[fVendas: 56.046 linhas] --> C[dClientes: ID Cliente]
  DV --> L[dLojas: ID Loja]
  DV --> P[dProdutos: SKU]
  DEV[fDevoluções: 1.809 linhas] --> L
  DEV --> P
  CAL[dCalendario] -.-> DV
  CAL -.-> DEV
~~~

As **cinco setas sólidas** correspondem às cinco relações ativas M:1 presentes em [relationships.json](../../modelo/relationships.json), com direção de filtro única. As **setas pontilhadas** representam o mapeamento de datas do [modelo JavaScript](../../web/model.mjs): venda pela Data da Venda; devolução pela Data Devolução. Não assumir que a ligação pontilhada corresponde a uma sexta relação DAX ativa sem validar o PBIX.

## Medidas e granularidade

| Medida | Fórmula resumida |
| --- | --- |
| Total Vendas | SUM(fVendas[Qtd Vendida]); unidades |
| Faturamento Total | SUMX(fVendas, Qtd × preço da dimensão produto) |
| Lucro Total | SUMX(fVendas, Qtd × (0,9 × preço − custo)) |
| % Margem de Lucro | Lucro / Faturamento |
| Total Devoluções | SUM(fDevoluções[Qtd Devolvida]); unidades |
| % Devoluções | Devoluções / Vendas |
| Faturamento Perdido | SUMX(fDevoluções, Qtd Devolvida × preço) |
| % Fat Perdido | Faturamento Perdido / Faturamento |

[Medidas DAX completas](../../modelo/dax_measures.json); [implementação JS](../../web/model.mjs).

## Verificação automatizada

`node --test tests/*.test.mjs` valida valores congelados, identidade matemática, recortes temporais, formatos ausentes e integridade de arquivos. `node scripts/recruitment_audit.mjs` gera resumo dos cinco relacionamentos e quantidade nula/negativa sem expor linhas. Os resultados do CI **não** significam que o DAX foi avaliado no Power BI Desktop.

[Auditoria](AUDITORIA.md) · [Evidências](EVIDENCIAS.md).
