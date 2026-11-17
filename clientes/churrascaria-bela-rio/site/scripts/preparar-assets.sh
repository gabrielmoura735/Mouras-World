#!/usr/bin/env bash
# Gera os assets do site demonstrativo a partir das fotos publicas da Bela Rio
# (site Wix atual e capa da ficha do Google). Originais ficam em $ORIG.
# Uso:  bash clientes/churrascaria-bela-rio/site/scripts/preparar-assets.sh <pasta-dos-originais>
set -euo pipefail
ORIG="${1:?pasta com wix-1.png wix-3.jpg wix-4.jpg wix-5.jpg wix-6.jpg google-capa.jpg}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/assets"
mkdir -p "$OUT"
FF="ffmpeg -hide_banner -loglevel error -y"

# Logo (1024x768, fundo branco): recorta margens e gera 2 tamanhos
$FF -i "$ORIG/wix-1.png" -vf "scale=520:-1:flags=lanczos" "$OUT/logo-520.png"
$FF -i "$ORIG/wix-1.png" -vf "scale=200:-1:flags=lanczos" "$OUT/logo-200.png"

# Hero: picanha no espeto (3652x2745)
$FF -i "$ORIG/wix-4.jpg" -vf "scale=1600:-1:flags=lanczos" -q:v 4 "$OUT/hero-picanha-1600.jpg"
$FF -i "$ORIG/wix-4.jpg" -vf "scale=800:-1:flags=lanczos" -q:v 5 "$OUT/hero-picanha-800.jpg"

# Salao (capa do Google, 1200x900) e cozinha (1925x975)
$FF -i "$ORIG/google-capa.jpg" -vf "scale=1000:-1:flags=lanczos" -q:v 4 "$OUT/salao-1000.jpg"
$FF -i "$ORIG/wix-6.jpg" -vf "scale=1000:-1:flags=lanczos" -q:v 4 "$OUT/cozinha-1000.jpg"

# Fundos decorativos do site atual: dourado com taca (bar) e escuro com vaca (tradicao)
$FF -i "$ORIG/wix-3.jpg" -vf "scale=1400:-1:flags=lanczos" -q:v 6 "$OUT/fundo-bar-1400.jpg"
$FF -i "$ORIG/wix-5.jpg" -vf "scale=1400:-1:flags=lanczos" -q:v 6 "$OUT/fundo-vaca-1400.jpg"

ls -la "$OUT"
