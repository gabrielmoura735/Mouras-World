#!/usr/bin/env bash
# Assets do site O Espeto do Parque a partir de ../pesquisa/fotos/ (capa do Google e fotos de avaliacoes).
set -euo pipefail
D="$(cd "$(dirname "$0")/.." && pwd)"; SRC="$D/../pesquisa/fotos"; OUT="$D/assets"; mkdir -p "$OUT"
FF="ffmpeg -hide_banner -loglevel error -y"
$FF -i "$SRC/01-avaliacao.jpg" -vf "scale=1600:-1:flags=lanczos" -q:v 4 "$OUT/hero-espetos-1600.jpg"
$FF -i "$SRC/01-avaliacao.jpg" -vf "scale=800:-1:flags=lanczos" -q:v 5 "$OUT/hero-espetos-800.jpg"
$FF -i "$SRC/00-capa-google.jpg" -vf "scale=1000:-1:flags=lanczos" -q:v 4 "$OUT/fachada-1000.jpg"
$FF -i "$SRC/02-avaliacao.jpg" -vf "scale=1000:-1:flags=lanczos" -q:v 4 "$OUT/espetinho-1000.jpg"
$FF -i "$SRC/03-avaliacao.jpg" -vf "scale=800:-1:flags=lanczos" -q:v 4 "$OUT/ambiente-800.jpg"
ls -la "$OUT"
