# Análise Comercial — roteiro de apresentação BI (3 minutos)

**Contexto:** bases didáticas, Power BI original preservado e dashboard web complementar sem DAX no navegador. O guia e os gráficos não são indicadores de operação real.

## 00:00–00:25 — Problema de negócio

Abrir [projeto no portfólio](https://leandroaugferreira.github.io/venda.html).

Fala: “O objetivo é analisar unidades vendidas, faturamento, margem calculada e devoluções por período, produto e canal. O relatório original é Power BI e a versão web apresenta os indicadores com JavaScript.”

## 00:25–01:00 — Definir indicadores

Abrir [guia do case](https://leandroaugferreira.github.io/comercial-case.html) e selecionar Total.

Fala: “As 56.046 linhas de vendas somam 84.174 **unidades**. O faturamento didático é a soma de quantidade vezes preço do cadastro, e o lucro usa uma fórmula específica: 90% do preço menos custo. Não é lucro líquido auditado.”

## 01:00–01:30 — Filtro por ano

Selecionar 2020, 2021 e 2022. Destaque 2021: 36.230 unidades e faturamento 5.982.860,68.

Fala: “As medidas foram reconciliadas com valores anteriores extraídos do modelo, mas não executei DAX no navegador. O crescimento nominal entre anos não demonstra automaticamente desempenho de uma empresa.”

## 01:30–02:00 — Devoluções

Mostrar 1.828 unidades devolvidas, taxa geral ~2,17% e valor nominal de itens devolvidos ~433.032,87.

Fala: “Devoluções são medidas por unidades, não por número de registros. Por ano, a data da devolução e a data da venda podem representar coortes diferentes, e não houve conciliação financeira ou pagamento real.”

## 02:00–02:35 — Arquitetura e qualidade

Abrir [arquitetura](ARQUITETURA.md), [DAX](../../modelo/dax_measures.json) e [qualidade](QUALIDADE_DADOS.md).

Fala: “Preservamos PBIX/XLSX e os hashes, conferimos integridade das cinco relações e criamos testes de valores brutos e filtros. O snapshot não atualiza sozinho.”

## 02:35–03:00 — Evidências e próximos passos

Abrir [GitHub Actions #42540265849](https://github.com/LeandroAugFerreira/analise-comercial/actions/runs/42540265849).

Fala: “32 testes Node foram aprovados, sendo 17 novos. O próximo passo seria um dicionário de métricas, validação de devoluções por coorte e testes browser/Power BI Desktop, sem inventar resultados comerciais.”

## Respostas a questionamentos

- *“Isso está em produção?”* Não, é dataset e dashboard didáticos.
- *“É Power BI Embedded?”* Não; o original é PBIX e a interface complementar usa JavaScript.
- *“R$ 15 milhões?”* O total é 15.226.080,56 de valores nominais do modelo; moeda específica não foi validada nesta revisão.
- *“Houve R$ 433 mil de prejuízo?”* Não foi provado. O nome da medida refere-se ao valor nominal dos itens devolvidos.
- *“Os 32 testes executaram DAX?”* Não. Validaram o modelo web e hashes/dados com referências independentes anteriores.

[Entrevista técnica](ENTREVISTA_TECNICA.md) · [Evidências](EVIDENCIAS.md).
