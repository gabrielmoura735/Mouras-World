# Esquina do Wagnão — cliente

Herda o `CLAUDE.md` da raiz. Negócio em foco aqui: restaurante self-service por quilo e lanchonete em Vila Pirituba (SP), com churrasco e buffet de saladas, almoço de segunda a sábado. Tom: comida de verdade, fartura, bairro. Nada da identidade da Lépore.

## Situação

Cliente de "site + presença digital", vindo da prospecção de 2026-11-16 (`dados/prospeccao-2026-11-16.md`, nicho pizzaria/restaurante). O site em `site/` é o site real do cliente: confirmar com o dono antes de publicar.

## Fontes dos dados (não inventar além disso)

- Ficha do Google Meu Negócio via MazyOS Scraper: `pesquisa/dados.json`
- Fotos: capa do Google e fotos públicas de avaliações (`pesquisa/fotos/`): salão, grelha de churrasco, buffet de saladas, pratos e o logo redondo "Esquina do Wagnão Restaurante e Lanchonete". Provisórias.
- Sem site, sem Instagram conhecido (a ficha não lista).

Contato público: WhatsApp (11) 97080-8926. Preço por quilo não é público: não colocar. O que aparece em fonte pública: self-service por quilo, buffet com variedade de saladas, frutas, carnes e guarnições, churrasco, pratos do dia (lasanha de berinjela citada), lanchonete.

## Estrutura

- `diagnostico.md`, `pesquisa/`, `site/` (CSS/JS de `templates/site-cliente/`, paleta laranja quente). Assets por `site/scripts/preparar-assets.sh`.

## Regras

- Fotos de avaliações são de clientes: trocar por fotos originais antes de publicar.
- Não publicar nada sem o Gabriel pedir e o cliente aprovar.
