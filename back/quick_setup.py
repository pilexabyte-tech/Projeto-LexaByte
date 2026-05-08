#!/usr/bin/env python
"""
Quick Setup Script - Executa todos os passos de integração MySQL
Execute uma vez e siga as instruções
"""

import subprocess
import sys
import os
from pathlib import Path

BACKEND_DIR = Path(__file__).parent
PYTHON_EXE = r"C:\Users\Aluno\AppData\Local\Programs\Python\Python312\python.exe"

def print_header(title):
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70)

def run_command(cmd, description):
    print(f"\n[➜] {description}")
    try:
        result = subprocess.run(cmd, shell=True, cwd=str(BACKEND_DIR), capture_output=False)
        if result.returncode == 0:
            print(f"[✓] {description} - OK")
            return True
        else:
            print(f"[✗] {description} - FALHOU (código {result.returncode})")
            return False
    except Exception as e:
        print(f"[✗] Erro: {e}")
        return False

print_header("🚀 LexaByte MySQL Quick Setup")

print("\nEste script irá:")
print("  1. Instalar mysqlclient")
print("  2. Instalar python-dotenv")
print("  3. Mostrar próximos passos")

# Passo 1: Instalar dependências
print_header("Passo 1: Instalar Dependências Python")

run_command(
    f'"{PYTHON_EXE}" -m pip install mysqlclient==2.2.0',
    "Instalando mysqlclient"
)

run_command(
    f'"{PYTHON_EXE}" -m pip install python-dotenv==1.0.0',
    "Instalando python-dotenv"
)

# Passo 2: Mostrar próximos passos
print_header("✓ Dependências Instaladas!")

print("""
PRÓXIMOS PASSOS (execute manualmente):

1️⃣  CONFIGURAR CREDENCIAIS
    Edite o arquivo .env com suas credenciais MySQL:
    
    DB_NAME=lexabyte
    DB_USER=root
    DB_PASSWORD=sua_senha
    DB_HOST=127.0.0.1
    DB_PORT=3306
    USE_SQLITE=false

2️⃣  CRIAR BANCO DE DADOS
    No MySQL/MariaDB, execute:
    
    CREATE DATABASE lexabyte CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

3️⃣  IMPORTAR SCHEMA
    No PowerShell (este diretório):
    
    mysql -u root lexabyte < lexabyte_mysql.sql
    
    (Se pedir senha, deixe em branco para padrão)

4️⃣  EXECUTAR MIGRATIONS
    
    {PYTHON_EXE} manage.py migrate

5️⃣  POPULAR BANCO COM DADOS
    
    {PYTHON_EXE} seed_mysql.py

6️⃣  INICIAR SERVIDOR
    
    {PYTHON_EXE} manage.py runserver

7️⃣  TESTAR API
    
    Abra no navegador:
    http://127.0.0.1:8000/api/conteudos/

""")

print("=" * 70)
print("📚 Para mais informações, consulte:")
print("   - RESUMO_MYSQL.md (resumo executivo)")
print("   - MYSQL_SETUP.md (guia detalhado)")
print("   - INTEGRATION_CHECKLIST.md (passo-a-passo)")
print("=" * 70)
