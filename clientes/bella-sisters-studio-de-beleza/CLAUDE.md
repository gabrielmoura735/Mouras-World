# Bella Sisters Studio de Beleza — cliente

Herda o `CLAUDE.md` da raiz. Negócio em foco aqui: studio de beleza em Parque São Domingos (Pirituba, SP), especializado em **dia da noiva** (cabelo e maquiagem de noiva e madrinhas). Tom: cuidado, acolhimento, "o dia mais importante". Nada da identidade da Lépore.

## Situação

Cliente de "site + presença digital", vindo da prospecção de 2026-11-16 (`dados/prospeccao-2026-11-16.md`, nicho estética). O site em `site/` é o site real do cliente: tudo que entra precisa ser confirmado com as donas antes de publicar.

## Fontes dos dados (não inventar além disso)

- Ficha do Google Meu Negócio via MazyOS Scraper: `pesquisa/dados.json` (gerado por `.claude/skills/site-cliente/scripts/pesquisar-lead.py`)
- Instagram: https://www.instagram.com/studio_bellasisters/ (título público: "Dia da Noiva em São Paulo"; bio e seguidores não puderam ser lidos)
- Fotos: capa do Google e fotos públicas de avaliações de clientes (`pesquisa/fotos/`). Mostram noivas e o studio. Provisórias.

Contato público: WhatsApp (11) 97959-1229. Preços não são públicos: não colocar. Serviços citados em fonte pública: cabelo e maquiagem de noiva, dia da noiva, maquiagem de madrinha, penteado. Só esses.

## Estrutura

- `diagnostico.md` — o que elas têm hoje e o que falta
- `pesquisa/` — dados brutos (json, fotos, mosaico)
- `site/` — site do cliente (HTML/CSS/JS puro). CSS/JS vêm de `templates/site-cliente/` com a paleta "salão". Assets por `site/scripts/preparar-assets.sh`

## Regras

- Fotos de avaliações são de clientes (noivas). Antes de publicar: trocar pelas fotos do studio ou pedir autorização.
- Não publicar nada sem o Gabriel pedir e o cliente aprovar.
