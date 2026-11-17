#!/usr/bin/env bash
# Assets do site Esquina do Wagnao a partir de ../pesquisa/fotos/ (capa do Google e fotos de avaliacoes).
set -euo pipefail
D="$(cd "$(dirname "$0")/.." && pwd)"; SRC="$D/../pesquisa/fotos"; OUT="$D/assets"; mkdir -p "$OUT"
FF="ffmpeg -hide_banner -loglevel error -y"
$FF -i "$SRC/04-avaliacao.jpg" -vf "scale=1600:-1:flags=lanczos" -q:v 4 "$OUT/hero-churrasco-1600.jpg"
$FF -i "$SRC/04-avaliacao.jpg" -vf "scale=800:-1:flags=lanczos" -q:v 5 "$OUT/hero-churrasco-800.jpg"
$FF -i "$SRC/00-capa-google.jpg" -vf "scale=1000:-1:flags=lanczos" -q:v 4 "$OUT/salao-1000.jpg"
$FF -i "$SRC/05-avaliacao.jpg" -vf "scale=1000:-1:flags=lanczos" -q:v 4 "$OUT/saladas-1000.jpg"
$FF -i "$SRC/06-avaliacao.jpg" -vf "scale=1000:-1:flags=lanczos" -q:v 4 "$OUT/buffet-1000.jpg"
$FF -i "$SRC/01-avaliacao.jpg" -vf "scale=800:-1:flags=lanczos" -q:v 4 "$OUT/prato-800.jpg"
$FF -i "$SRC/03-avaliacao.jpg" -vf "scale=400:-1:flags=lanczos" "$OUT/logo-400.png"
ls -la "$OUT"
