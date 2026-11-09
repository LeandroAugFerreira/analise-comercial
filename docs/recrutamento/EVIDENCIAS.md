# Análise Comercial — evidências técnicas executadas

**Data:** 08/11/2026, referência do código auditado. **CI:** [GitHub Actions #42540265849](https://github.com/LeandroAugFerreira/analise-comercial/actions/runs/42540265849), commit `947665ac2a3ee75d856fa46dba16d3a4f4baa5c0`.

## Resultados reais

| Verificação | Resultado |
| --- | --- |
| Node.js Test Runner, verificação de indicadores e fontes | **32 testes aprovados, zero falhas** |
| Casos preexistentes | 15 |
| Casos novos de negócio/qualidade | **17**, em [recrutamento.test.mjs](../../tests/recrutamento.test.mjs) |
| Integridade dos originais PBIX/XLSX | SHA-256 verificado nos testes existentes |
| Integridade do snapshot `web/data.json` | SHA-256 e contagens verificados |
| Reconciliação dos filtros existentes | Golden data verificada; casos anteriores preservados |
| Diagnóstico agregado de relações e quantidade | Script executado e artifact `analise-comercial-qualidade-agregada` criado |
| Dados pessoais no diagnóstico agregado | Nenhum ID/nome/linha exportado |

Os valores `golden` foram calculados **em preparação anterior** de forma independente, com Python. Esta execução comparou o modelo JS com essas referências preservadas; **não** usou Power BI Desktop ou motor DAX.

## O que os 17 novos testes conferiram

- Escopo de base comercial, tabelas fVendas/fDevoluções e três páginas.
- Diferença entre unidades e registros da fato.
- Recomputação independente de faturamento pela quantidade/preço de produto.
- Regra de “Lucro Total”: `quantidade × (90% do preço − custo)`, confirmada também no DAX.
- Margem do lucro calculado dividida pelo faturamento; sem desconto automático de devoluções.
- Devoluções em **unidades**, não contagem de linhas.
- Valor nominal de itens devolvidos: quantidade × preço.
- Partição por 2020, 2021 e 2022 recompõe unidades, faturamento, lucro e devoluções.
- Reconciliação da captura didática de 2021 (36.230 unidades e faturamento 5.982.860,68).
- Crescimento nominal do número de unidades 2020→2021 como fórmula, sem narrativa causal.
- Participação de `Online` sobre as unidades totais.
- Filtro por tipo Notebook com unidade/faturamento/taxa próprios.
- Julho/2021 como subconjunto de 2021.
- Contexto sem registros (1999) produz **null** para margem e taxas, evitando 0% inventado.
- Parâmetro desconectado não altera total.
- Cinco relações com fato/dimensão e chave declaradas.
- Indicador inexistente retorna `null`, sem inventar resultado.

## Diagnóstico de qualidade realmente calculado

Na base didática: **56.046 linhas de vendas, 1.809 linhas de devolução, 84.174 unidades vendidas, 1.828 devolvidas**. As cinco relações do modelo declaradas no JSON tiveram **zero linhas sem correspondência e zero chaves de dimensão duplicadas**. Nos campos de quantidade de ambas as fatos, nenhuma linha zero/negativa ou sem número. [Detalhamento](QUALIDADE_DADOS.md).

## Não executado / não comprovado

- Power BI Desktop, motor DAX, refresh de Power Query e novo PBIX.
- SQL, banco operacional, API de vendas ou gateway de pagamento.
- Novos testes de navegador, acessibilidade, comparação pixel a pixel dos 28 visuais.
- Emissão de notas, estornos e lucro líquido, moedas ou taxas tributárias.
- Operação comercial, clientes reais, resultados financeiros ou melhora causada pelo dashboard.

## Como mostrar ao recrutador

[Dashboard web original](https://leandroaugferreira.github.io/dashboards/comercial/) · [Guia do case](https://leandroaugferreira.github.io/comercial-case.html) · [Testes](../../tests/recrutamento.test.mjs) · [CI completo](https://github.com/LeandroAugFerreira/analise-comercial/actions/runs/42540265849).

[Auditoria](AUDITORIA.md) · [Roteiro](ROTEIRO_DEMO.md).
