# Validação — 03/11/2026

Execução local com Node.js, sem instalar dependências da aplicação. **15 testes aprovados**; código de saída 0. Saída integral: [resultado-node.txt](resultado-node.txt).

Os testes conferem integridade das fontes e snapshot, identidades financeiras/logísticas, filtros e ausência de dados. A análise comercial também confere os valores da captura publicada em 2021. Os valores esperados comercial/logístico foram calculados independentemente em Python a partir das tabelas exportadas.

Hash SHA-256 de web/data.json: `4014900b538139eb7490cb7d6c9560b2b1fc0300d9b4abe6952de9468f0fd449`.

As páginas foram inspecionadas no navegador local; seleções e navegação foram exercitadas. A comparação visual não certifica reprodução pixel a pixel do Power BI nem todos os estados possíveis de filtros. O workflow remoto será consultado em [Actions](https://github.com/LeandroAugFerreira/analise-comercial/actions).


---

## Auditoria de recrutamento — revisão de 08/11/2026

[GitHub Actions #42540265849](https://github.com/LeandroAugFerreira/analise-comercial/actions/runs/42540265849) passou com **32 testes Node**: 15 casos preexistentes e **17 novos** em [recrutamento.test.mjs](../tests/recrutamento.test.mjs). O script [recruitment_audit.mjs](../scripts/recruitment_audit.mjs) também foi executado, produzindo resumo agregado sem dados individuais.

A base contém **56.046 linhas de venda / 84.174 unidades**, **1.809 linhas de devolução / 1.828 unidades**. As cinco relações M:1 declaradas no JSON não apresentaram chaves órfãs nem duplicadas no lado da dimensão; nenhuma quantidade de venda/devolução zero, negativa ou não numérica foi encontrada. [Escopo exato](recrutamento/QUALIDADE_DADOS.md).

Foram reconfirmadas as fórmulas nominais de faturamento, lucro do exercício com fator 0,9, perda estimada de produtos devolvidos, taxas, recortes por ano, canal Online e produto Notebook. **Não houve atualização dos originais, novo Power BI Desktop, execução DAX oficial, transações reais ou novas medições de navegador.** [Evidências](recrutamento/EVIDENCIAS.md).
