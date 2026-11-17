@echo off
chcp 65001 > nul
echo ========================================================
echo       MOTOR STATUS - PROSPECÇÃO AUTÔNOMA MAZYOS
echo ========================================================
echo Iniciando varredura e auditoria dos nichos de mercado...
echo.

cd /d "%~dp0"
python automacao_pipeline.py

echo.
echo ========================================================
echo Operação concluída! Verifique o painel STATUS.md.
echo ========================================================
pause

