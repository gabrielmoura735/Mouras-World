#!/usr/bin/env bash
# Assets do site Bella Sisters a partir das fotos publicas em ../pesquisa/fotos/ (capa do Google e fotos de avaliacoes).
set -euo pipefail
D="$(cd "$(dirname "$0")/.." && pwd)"; SRC="$D/../pesquisa/fotos"; OUT="$D/assets"; mkdir -p "$OUT"
FF="ffmpeg -hide_banner -loglevel error -y"
$FF -i "$SRC/06-avaliacao.jpg" -vf "scale=1600:-1:flags=lanczos" -q:v 4 "$OUT/hero-studio-1600.jpg"
$FF -i "$SRC/06-avaliacao.jpg" -vf "scale=800:-1:flags=lanczos" -q:v 5 "$OUT/hero-studio-800.jpg"
$FF -i "$SRC/05-avaliacao.jpg" -vf "scale=1000:-1:flags=lanczos" -q:v 4 "$OUT/studio-maquiagem-1000.jpg"
$FF -i "$SRC/04-avaliacao.jpg" -vf "scale=800:-1:flags=lanczos" -q:v 4 "$OUT/penteado-800.jpg"
$FF -i "$SRC/02-avaliacao.jpg" -vf "scale=800:-1:flags=lanczos" -q:v 4 "$OUT/noiva-800.jpg"
$FF -i "$SRC/07-avaliacao.jpg" -vf "scale=1000:-1:flags=lanczos" -q:v 4 "$OUT/madrinhas-1000.jpg"
$FF -i "$SRC/00-capa-google.jpg" -vf "scale=800:-1:flags=lanczos" -q:v 4 "$OUT/capa-800.jpg"
ls -la "$OUT"
