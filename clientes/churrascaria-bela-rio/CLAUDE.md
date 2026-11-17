# Churrascaria Bela Rio — cliente

Herda o `CLAUDE.md` da raiz. Aqui o negócio em foco **não é a Lépore**: é uma churrascaria tradicional gaúcha da Lapa (SP), fundada em 1972. Tom: tradição, fartura, família, brasa. Nada de "crocante/sequinho" nem identidade da Lépore.

## Situação

Cliente de "site + presença digital", vindo da prospecção de 2026-11-16 (`dados/prospeccao-2026-11-16.md`). O site em `site/` é o site real do cliente, não demonstração: tudo que entra nele precisa ser confirmado com o dono antes de publicar (preço, WhatsApp, fotos originais).

## Fontes dos dados (não inventar nada além disso)

- Ficha do Google Meu Negócio, via MazyOS Scraper: `mazyos-scraper/webdata/08ca1e4c-a1c5-409e-bb9b-f32ff56c280c.csv` (linha "Churrascaria Bela Rio")
- Site atual: https://tucdesign.wixsite.com/churrascariabelario (Wix gratuito, 2018)
- Instagram: https://www.instagram.com/churrascariabelario/ (13,2 mil seguidores)
- Facebook: https://www.facebook.com/ChurrascariaBelaRiooficial/ (162 seguidores; o link do Wix antigo, facebook.com/churrascariabelario, está quebrado). Instagram secundário listado no Wix: https://www.instagram.com/churrascariabela/

Telefone público: (11) 3611-0180 (Google) e (11) 3611-1977 (site). **WhatsApp não é público: não colocar número nenhum.** Preço normal do rodízio não é público: não colocar preço.

## Estrutura

- `diagnostico.md` — o que eles têm hoje e o que falta (base da proposta)
- `site/` — site do cliente (HTML/CSS/JS puro, abre com duplo clique). Assets otimizados em `site/assets/`, gerados por `site/scripts/preparar-assets.sh` a partir das fotos públicas deles
- `pendencias.md` — (futuro) o que falta o cliente passar: WhatsApp, preço do rodízio, fotos originais, acesso ao Google Meu Negócio, domínio

## Regras

- Fotos atuais vieram do site antigo e da ficha do Google, em baixa resolução. Pedir as originais ao cliente antes de publicar.
- Avaliações no site são trechos reais do Google, com nome e nota, sem editar.
- Não publicar nada (Vercel, domínio, redes) sem o Gabriel pedir e sem o cliente aprovar.
