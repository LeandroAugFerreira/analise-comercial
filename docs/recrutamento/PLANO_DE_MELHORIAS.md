# Análise Comercial — plano de evolução priorizado para Dados/BI

**Revisão:** 08/11/2026. **Objetivo:** demonstrar maturidade analítica antes de adicionar novos dashboards. Fontes didáticas sem resultado comercial real.

| Ordem | Trabalho | Valor para recrutadores | Esforço | Risco | Critério de aceite |
| --- | --- | --- | --- | --- | --- |
| P0 | Reconciliar faturamento, lucro calculado, unidades, devoluções, anos e filtros | Muito alto | Baixo | Baixo | 32 testes Node aprovados |
| P0 | Auditar chaves M:1 e quantidades positivas sem exportar linhas individuais | Alto | Baixo | Baixo | Diagnóstico agregado gerado no CI |
| P0 | Estudo de caso com DAX, diferenças entre venda e devolução e limites | Alto | Baixo | Baixo | Documentos e roteiro com fontes |
| P0 | Guia web para triagem e link ao dashboard interativo já existente | Alto | Médio | Baixo | Sem backend, login ou novos dados |
| P1 | Dicionário de métricas: unidade monetária, datas, fórmulas e escopo | Muito alto | Baixo/médio | Baixo | Glossário revisado por indicador |
| P1 | Renomear/explicar “Faturamento Perdido” como estimativa nominal de itens devolvidos | Alto | Baixo | Baixo | Não afirmar estornos ou prejuízo líquido |
| P1 | Estudar devoluções por coorte vinculadas à venda original | Muito alto | Médio/alto | Alto se faltar chave | Cálculo documentado com vínculo verificável |
| P1 | Teste real de navegação/acessibilidade do dashboard em navegador | Alto | Médio | Médio | Playwright/axe em dados didáticos |
| P1 | Verificar outliers de preço, custos e valores nulos no Power Query | Alto | Médio | Médio | QA offline sem excluir linhas silenciosamente |
| P1 | Comparar medidas DAX e JS nos mesmos contextos no Power BI Desktop | Alto | Alto | Médio | Matriz de equivalência e divergências conhecidas |
| P2 | Parametrizar origens M e criar pipeline de atualização versionada | Alto | Alto | Médio/alto | Snapshot + hash + aceite de publicação |
| P2 | SQL demonstrativo para preparar KPIs em banco sintético | Forte para vagas SQL | Médio | Baixo | Consultas SQL reprodutíveis vs medidas |
| P2 | Performance da web com 19 MB de snapshot e filtros repetidos | Médio/alto | Médio | Médio | Tempo de carregamento medido e otimizado |
| P3 | Análises de coorte, mix de produto e margem por canal | Alto se fontes permitirem | Alto | Médio | Hipóteses, métricas e testes novos |

## Entrega efetiva desta revisão

- 17 novos testes Node, total **32 aprovados** no [CI #42540265849](https://github.com/LeandroAugFerreira/analise-comercial/actions/runs/42540265849).
- Diagnóstico de cinco relações sem órfãos e sem duplicatas, com zero registros de quantidade não positiva.
- Nove documentos de recrutamento e guia explicativo sobre os KPIs, sem alterar DAX, Power Query ou dados originais.
- Página original do dashboard permanece disponível em https://leandroaugferreira.github.io/dashboards/comercial/.

## Recomendação para portfólio e currículo

Não apresentar números nominais do dataset como faturamento de clientes reais ou eficiência empresarial. Destacar **capacidade de formular indicadores, verificar referências, documentar ambiguidade e demonstrar testes**. Se adicionar SQL, manter a mesma base fictícia e comparar seus resultados com o modelo.

[Qualidade](QUALIDADE_DADOS.md) · [Estudo](ESTUDO_DE_CASO.md) · [Roteiro](ROTEIRO_DEMO.md).
