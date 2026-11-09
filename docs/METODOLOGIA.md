# Metodologia e preservação

Os arquivos em originais/ mantêm os bytes e hashes da origem. As tabelas do PBIX foram lidas sem atualização de fontes e sem recalcular colunas dependentes da data corrente. modelo/ contém medidas DAX, consultas Power Query e esquema reais extraídos. O layout e os fundos provêm do PBIX.

A implementação JavaScript cobre os indicadores visíveis. Os testes usam valores esperados calculados independentemente em Python, incluindo períodos sem dados. O snapshot integral tem contagens e hash; as fontes binárias têm SHA-256. Todas as tabelas exportadas são mantidas, incluindo calendários automáticos.

Referência do extrator: [PBIXRay](https://github.com/Hugoberry/pbixray), versão usada 0.15.5. Ele lê o modelo e não avalia DAX. A interface web tem cálculos próprios explícitos; as expressões DAX originais são fornecidas para revisão.

Mapas: [IBGE, API de malhas](https://servicodados.ibge.gov.br/api/docs/malhas?versao=3) e [Natural Earth](https://github.com/nvkelso/natural-earth-vector), arquivos locais consultados em 03/11/2026. As bolhas por UF/continente representam as mesmas categorias do modelo, sobre uma malha simplificada. Árvore de decomposição com navegação manual; não executa análises de IA do Power BI.

Faturamento = soma de quantidade × preço do produto. Lucro segue exatamente a medida do PBIX: quantidade × (preço × 0,9 − custo). Não foi substituído por faturamento menos custo simples. As taxas de devolução usam unidades devolvidas / unidades vendidas no mesmo recorte; perda financeira usa preço de venda dos produtos devolvidos.

A captura do portfólio em 2021 é reconciliável: faturamento 5.982.860,68; lucro 3.872.367,712; 36.230 unidades. O PBIX fornecido abre salvo em 2022.


## Complemento de metodologia e cautelas — 08/11/2026

A auditoria acrescentou 17 testes de reconciliação de indicadores e um script de qualidade. Cada relacionamento ativo M:1 extraído entre as duas tabelas fato e as dimensões cliente/loja/produto foi conferido por chaves: zero linhas sem correspondente, zero duplicatas no lado da dimensão. São somente verificações do snapshot estático, não reavaliação de Power BI Desktop nem de toda a qualidade da origem.

`Total Vendas` mede **unidades vendidas**, não transações. `Lucro Total` é um indicador didático baseado em `quantidade × (preço × 0,9 − custo)`, e não lucro líquido. `Faturamento Perdido` representa preço cadastrado de itens devolvidos, não estorno financeiro comprovado.

Os filtros de período usam datas de **venda** e **devolução** distintas na camada JavaScript: o percentual de devoluções por período não deve ser interpretado como taxa de retorno de uma mesma coorte de vendas sem vínculo transacional adicional. [Estudo de caso](recrutamento/ESTUDO_DE_CASO.md) · [Qualidade](recrutamento/QUALIDADE_DADOS.md).
