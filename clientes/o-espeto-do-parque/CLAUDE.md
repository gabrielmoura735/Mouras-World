# O Espeto do Parque — cliente

Herda o `CLAUDE.md` da raiz. Negócio em foco aqui: espetaria e bar em Vila Pirituba (SP), com espetinhos, porções, hambúrgueres, cerveja gelada e música ao vivo. Tom: descontraído, de bairro, "happy hour". Nada da identidade da Lépore.

## Situação

Cliente de "site + presença digital", vindo da prospecção de 2026-11-16 (`dados/prospeccao-2026-11-16.md`, nicho churrascaria). O site em `site/` é o site real do cliente: confirmar com o dono antes de publicar.

## Fontes dos dados (não inventar além disso)

- Ficha do Google Meu Negócio via MazyOS Scraper: `pesquisa/dados.json`
- Instagram: https://instagram.com/oespetodoparque55 (cadastrado como "site" na ficha; a fachada mostra o mesmo @ e o telefone)
- Fotos: capa do Google (fachada) e fotos públicas de avaliações: hambúrguer com espetinhos, espetinhos, ambiente. Provisórias.

Contato público: WhatsApp (11) 91612-2716 (está pintado na fachada). Preços não são públicos: não colocar. O que aparece em fonte pública: espetinhos variados, porções, hambúrgueres, feijoada (citada num pedido por iFood), cerveja gelada, música ao vivo na sexta.

## Estrutura

- `diagnostico.md`, `pesquisa/`, `site/` (CSS/JS de `templates/site-cliente/`, paleta brasa). Assets por `site/scripts/preparar-assets.sh`.

## Regras

- Fotos de avaliações são de clientes: trocar por fotos originais antes de publicar.
- Não publicar nada sem o Gabriel pedir e o cliente aprovar.
