#!/usr/bin/env python
"""
Script de setup para integração MySQL
Instala dependências e configura Django
"""
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
BACK_DIR = REPO_ROOT / "back"
SQL_SOURCE = REPO_ROOT / "bd" / "lexabyte_mysql.sql"
SQL_DEST = BACK_DIR / "lexabyte_mysql.sql"

print("=" * 60)
print("🔧 LexaByte MySQL Setup")
print("=" * 60)

# Tentar instalar mysqlclient (preferido)
print("\n[1/3] Instalando driver MySQL...")
try:
    subprocess.check_call([
        sys.executable, "-m", "pip", "install",
        "mysqlclient==2.2.0"
    ])
    print("✓ mysqlclient instalado com sucesso")
except Exception as e:
    print(f"⚠ mysqlclient falhou: {e}")
    print("  Tentando mysql-connector-python...")
    try:
        subprocess.check_call([
            sys.executable, "-m", "pip", "install",
            "mysql-connector-python"
        ])
        print("✓ mysql-connector-python instalado")
    except Exception as e2:
        print(f"✗ Nenhum driver MySQL foi instalado: {e2}")
        sys.exit(1)

print("\n[2/3] Copiando arquivo lexabyte_mysql.sql...")
import shutil
try:
    shutil.copy(SQL_SOURCE, SQL_DEST)
    print("✓ SQL schema copiado")
except Exception as e:
    print(f"⚠ Não foi possível copiar SQL: {e}")

print("\n[3/3] Criando migrations...")
try:
    subprocess.check_call([
        sys.executable, "manage.py", "makemigrations"
    ])
    print("✓ Migrations criadas")
except Exception as e:
    print(f"⚠ Erro ao criar migrations: {e}")

print("\n" + "=" * 60)
print("✓ Setup concluído!")
print("=" * 60)
print("\n⚠️  PRÓXIMOS PASSOS:")
print("1. Configure as credenciais MySQL em lexabyte/settings.py")
print("2. Importe o arquivo lexabyte_mysql.sql no MySQL:")
print("   mysql -u root -p < lexabyte_mysql.sql")
print("3. Execute: python manage.py migrate")
print("4. Execute: python seed_mysql.py (para popular dados)")
