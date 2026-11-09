# Análise Comercial — auditoria técnica para recrutamento de Dados/BI

**Base:** código de `main` em 08/11/2026, commit `9c1bd1af60c201e016ae52f6b8444181fd8f901e`. **Objetivo:** construir um case de BI verificável, sem confundir um conjunto didático com indicadores de empresa em produção. Não é auditoria contábil nem revalidação do Power BI Desktop.

## Parecer técnico

O projeto preserva fontes Excel, PBIX, medidas DAX, Power Query, esquema, relações e o layout original de um exercício de análise comercial. A apresentação web é uma aplicação **HTML/CSS/JavaScript/SVG com cálculos próprios**, alimentada por um snapshot local do PBIX. O valor para recrutadores está em **definir as métricas, demonstrar reconciliação, examinar integridade e reconhecer limites de interpretação**.

O autor confirmou em 03/11/2026 que os dados são **fictícios/didáticos e autorizados para publicação**. Não apresentá-los como vendas, clientes ou lucro de empresa própria.

## Evidência efetivamente examinada

- [README](../../README.md), [metodologia](../METODOLOGIA.md), [arquitetura](../ARQUITETURA.md), [validação histórica](../VALIDACAO.md).
- [Medidas DAX](../../modelo/dax_measures.json), [colunas DAX](../../modelo/dax_columns.json), [Power Query M](../../modelo/power_query.json), [relacionamentos](../../modelo/relationships.json) e [schema](../../modelo/schema.json).
- [Modelo de indicadores JavaScript](../../web/model.mjs), [interface](../../web/app.mjs), [configuração](../../web/config.json), [snapshot](../../web/data.json), [referências independentes](../../tests/golden.json).
- [Testes existentes](../../tests/model.test.mjs), [17 testes novos](../../tests/recrutamento.test.mjs), [diagnóstico agregado](../../scripts/recruitment_audit.mjs), [CI](../../.github/workflows/tests.yml).
- [Hashes dos originais](../../originais/SHA256.json) e cópias preservadas de PBIX/XLSX.

A revisão **não abriu Power BI Desktop, não recalculou DAX em motor oficial, não renovou as fontes e não alterou PBIX, XLSX, JSON de dados, consultas ou fórmulas existentes**.

## Granularidade e dimensão da base

| Tabela de negócio | Linhas |
| --- | ---: |
| fVendas | 56.046 |
| fDevoluções | 1.809 |
| dClientes | 18.148 |
| dLojas | 306 |
| dProdutos | 293 |
| dCalendario | 1.096 |
| Parâmetro | 2 |

Existem também tabelas técnicas de datas automáticas no snapshot. **Total Vendas = soma de quantidades**, não contagem de linhas: são **84.174 unidades** em 56.046 registros.

## Definições que o recrutador deve saber

| Indicador | Regra DAX / implementação web | Total didático |
| --- | --- | ---: |
| Total Vendas | SUM Qtd Vendida | 84.174 unidades |
| Faturamento Total | SUMX Qtd × Preço Unitario | 15.226.080,56 unidades monetárias do modelo |
| Lucro Total | SUMX Qtd × (0,9 × Preço Unitario − Custo Unitario) | 9.842.627,604 |
| % Margem de Lucro | Lucro Total / Faturamento Total | 64,64% |
| Total Devoluções | SUM Qtd Devolvida | 1.828 unidades |
| % Devoluções | Devolvidas / Vendidas no mesmo contexto de filtro | 2,17% |
| Faturamento Perdido | SUMX Qtd Devolvida × Preço Unitario | 433.032,87 |
| % Fat Perdido | Faturamento Perdido / Faturamento Total | 2,84% |

**Crítico:** “Lucro Total” segue uma regra didática com fator 0,9 do preço, não equivale a lucro líquido auditado. “Faturamento Perdido” é valor atribuído às unidades devolvidas pelo preço cadastrado, **não** comprovante de estorno, baixa financeira ou prejuízo contábil efetivo. A unidade monetária não foi validada como moeda específica nesta revisão.

## Crescimento e filtros

A versão web testa filtros de 2020, 2021, 2022, lojas Online, tipo Notebook e períodos compostos. A captura didática de 2021 é reconciliada por referências: 36.230 unidades, faturamento 5.982.860,68 e lucro calculado 3.872.367,712.

O crescimento de 2021 em unidades sobre 2020 é grande porque o dataset apresenta 2.630 unidades em 2020 e 36.230 em 2021. **Não atribuir causalidade, taxa orgânica de crescimento ou comparabilidade comercial dos anos sem verificar cobertura das fontes.**

O calendário filtra **venda pela Data da Venda** e **devolução pela Data Devolução** na versão web; o índice `% Devoluções` por período pode combinar **coortes diferentes** (devoluções ocorridas no período versus vendas ocorridas nele). Não se trata automaticamente da taxa de retorno das vendas originadas naquele período.

## Qualidade verificada no CI

Os cinco relacionamentos ativos declarados no JSON do modelo têm **zero registros sem chave correspondente** e **zero chaves duplicadas** no lado da dimensão. Não foram encontrados registros de venda/devolução com quantidade zero/negativa ou sem valor numérico nesses dois campos. Isso **não** valida todas as regras comerciais ou origem das planilhas. Consulte [QUALIDADE_DADOS.md](QUALIDADE_DADOS.md).

## Limites e riscos

- A interface web não executa DAX nem garante equivalência para todos os contextos e visuais de Power BI.
- O JSON é estático, não faz refresh; não é dashboard de vendas em tempo real.
- Fontes externas de curso didático e caminhos legados do Power Query são parte do PBIX; parametrizar ao reproduzir em outro computador, sem publicar caminhos locais.
- Não houve SQL, cliente real, faturamento verificado, fluxo de caixa, ROI, melhoria de margem ou impacto empresarial.
- As tabelas foram declaradas fictícias/autorizadas, mas a publicação pública do snapshot significa que **todo seu conteúdo pode ser acessado**. Não acrescentar novas bases sem revisão de privacidade/licença.

## Testes executados

[GitHub Actions #42540265849](https://github.com/LeandroAugFerreira/analise-comercial/actions/runs/42540265849): **32 testes Node aprovados** (15 existentes + 17 novos) e diagnóstico de qualidade agregado gerado com sucesso, sem publicar linhas identificáveis. Não é teste do DAX em Power BI Desktop.

**Descrição para currículo/entrevista:** “Estudo de caso didático de BI comercial com Power BI, DAX, Power Query e visualização web complementar; reconciliados indicadores de 84.174 unidades vendidas e 1.828 devolvidas, documentando fórmulas e limites, com 32 testes automatizados.”

[Estudo de caso](ESTUDO_DE_CASO.md) · [Evidências](EVIDENCIAS.md) · [Plano](PLANO_DE_MELHORIAS.md).
