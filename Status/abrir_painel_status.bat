@echo off
chcp 65001 > nul
echo ========================================================
echo       MOURA.AI STATUS — PAINEL DE PROSPECÇÃO WEB
echo ========================================================
echo Abrindo o painel no navegador padrão...

start "" "%~dp0index.html"
exit

