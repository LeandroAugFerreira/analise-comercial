# Protocolo seguro de reprodução — Análise Comercial

## Testes executados no CI

[GitHub Actions #42540265849](https://github.com/LeandroAugFerreira/analise-comercial/actions/runs/42540265849): **32 testes aprovados, 0 falhas**; 15 antigos e 17 novos. O script de auditoria agregada executou após os testes e gerou artefato temporário `analise-comercial-qualidade-agregada`.

## Dados e isolamento

- Fontes originais Excel e PBIX permanecem intactas. O teste de hash verifica seus bytes.
- `web/data.json` é um snapshot didático versionado, publicado anteriormente com autorização do autor. O teste não renova nem altera o conteúdo.
- `tests/golden.json` contém referências calculadas independentemente em preparação anterior. O CI atual apenas confere valores.
- `scripts/recruitment_audit.mjs` gera `reports/quality-summary.json` com **contagens agregadas**, sem linhas, clientes, lojas, SKU ou identificadores de vendas.
- Sem credenciais, banco de terceiros, APIs, DAX online ou dados reais de negócio na nova execução.

## Execução em clone

~~~sh
git clone https://github.com/LeandroAugFerreira/analise-comercial.git
cd analise-comercial
node --test tests/*.test.mjs
node scripts/recruitment_audit.mjs
python -m http.server 8000 --directory web
~~~

Abra http://localhost:8000 para explorar a interface web. Os testes só usam módulos padrão de Node.js 22. O servidor Python serve a versão estática, não executa Power BI/DAX nem Power Query.

## O que os testes não comprovam

- Contabilização de pagamentos, devoluções bancárias ou lucro líquido.
- Associação de cada devolução à venda original (coorte de vendas).
- Power BI Desktop, refresh de Power Query, equivalência universal de DAX/JS.
- Responsividade de navegador real, acessibilidade, telemetria, cargas de produção.
- Moeda e impostos aplicáveis, crescimento real, decisões operacionais tomadas.

## Resultado de qualidade

Cinco relações M:1 sem linhas órfãs nem chaves duplicadas do lado das dimensões; quantidades positivas de venda/devolução. Essa afirmação tem escopo estrito: **campos e relações verificados no snapshot atual**, não todos os requisitos de qualidade.

[Auditoria](AUDITORIA.md) · [Evidências](EVIDENCIAS.md).
