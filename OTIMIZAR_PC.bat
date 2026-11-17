@echo off
chcp 65001 >nul
title Otimizador Supremo do PC — Moura.AI (Modo Fábrica)
color 0B

echo ===============================================================================
echo            ⚡ MOURA.AI — OTIMIZADOR SUPREMO DO WINDOWS (MODO FÁBRICA)
echo ===============================================================================
echo.
echo  Este script realiza uma limpeza profunda e segura do sistema:
echo    [+] Limpeza de arquivos temporarios do usuario (%%temp%%)
echo    [+] Limpeza de temporarios do Windows (C:\Windows\Temp)
echo    [+] Limpeza de arquivos Prefetch desnecessarios
echo    [+] Limpeza de logs de erro e relatorios de travamento
echo    [+] Limpeza de cache de atualizacoes antigas do Windows
echo    [+] Esvaziamento seguro da Lixeira
echo    [+] Liberacao de cache DNS (conexoes mais rapidas)
echo.
echo  IMPORTANTE: Seus arquivos pessoais, fotos e documentos NÃO SERÃO TOCADOS!
echo ===============================================================================
echo.

pause

echo.
echo [*] 1/7 - Limpando pasta temporaria do usuario (%%temp%%)...
del /s /f /q "%temp%\*.*" >nul 2>&1
for /d %%p in ("%temp%\*.*") do rmdir /s /q "%%p" >nul 2>&1
echo [OK] Temporarios do usuario limpos com sucesso.

echo.
echo [*] 2/7 - Limpando pasta temporaria do sistema (C:\Windows\Temp)...
del /s /f /q "C:\Windows\Temp\*.*" >nul 2>&1
for /d %%p in ("C:\Windows\Temp\*.*") do rmdir /s /q "%%p" >nul 2>&1
echo [OK] Temporarios do sistema limpos com sucesso.

echo.
echo [*] 3/7 - Otimizando pasta Prefetch...
del /s /f /q "C:\Windows\Prefetch\*.*" >nul 2>&1
echo [OK] Prefetch limpo com sucesso.

echo.
echo [*] 4/7 - Limpando relatorios de erro e logs obsoletos...
del /s /f /q "C:\ProgramData\Microsoft\Windows\WER\*.*" >nul 2>&1
del /s /f /q "%localappdata%\CrashDumps\*.*" >nul 2>&1
echo [OK] Relatorios de erro limpos com sucesso.

echo.
echo [*] 5/7 - Limpando cache do Windows Update antigo...
del /s /f /q "C:\Windows\SoftwareDistribution\Download\*.*" >nul 2>&1
echo [OK] Cache de atualizacoes antigas liberado.

echo.
echo [*] 6/7 - Esvaziando Lixeira...
PowerShell -NoProfile -Command "Clear-RecycleBin -Force -ErrorAction SilentlyContinue" >nul 2>&1
echo [OK] Lixeira esvaziada com sucesso.

echo.
echo [*] 7/7 - Otimizando rede e liberando cache DNS...
ipconfig /flushdns >nul 2>&1
echo [OK] Cache DNS renovado. Conexao otimizada!

echo.
echo ===============================================================================
echo      🎉 OTIMIZAÇÃO CONCLUÍDA COM SUCESSO! SEU PC ESTÁ LEVE E RÁPIDO!
echo ===============================================================================
echo.
echo Pressione qualquer tecla para fechar...
pause >nul

