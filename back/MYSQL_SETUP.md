# 🔧 Integração MySQL — LexaByte Backend

## Status

✅ Modelos Django criados para MySQL schema  
✅ Settings.py configurado para MySQL com fallback SQLite  
✅ Dependências atualizadas  
⏳ **Próximo passo: Configurar credenciais e executar migrate**

---

## Pré-requisitos

- MySQL/MariaDB instalado e rodando
- Python 3.12 com dependências
- Conhecimento básico de MySQL

---

## Instalação do Driver MySQL

### Opção 1: mysqlclient (Recomendado)

```powershell
# No PowerShell, na pasta do backend:
& "C:\Users\Aluno\AppData\Local\Programs\Python\Python312\python.exe" -m pip install mysqlclient==2.2.0
```

### Opção 2: mysql-connector-python

```powershell
& "C:\Users\Aluno\AppData\Local\Programs\Python\Python312\python.exe" -m pip install mysql-connector-python
```

Caso `mysqlclient` falhe, o Django tentará usar `mysql-connector-python` automaticamente.

---

## Configuração de Credenciais

### 1. Copiar arquivo de exemplo

```powershell
copy .env.example .env
```

### 2. Editar `.env` com suas credenciais MySQL

```
DB_NAME=lexabyte
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_HOST=127.0.0.1
DB_PORT=3306
USE_SQLITE=false
```

**Valores padrão:**
- Host: `127.0.0.1` (localhost)
- Port: `3306` (padrão MySQL)
- User: `root` (usuário padrão XAMPP)
- Password: vazio (padrão XAMPP)

### 3. Carregar variáveis de ambiente (opcional)

Para que Django leia as variáveis, instale `python-dotenv`:

```powershell
& "C:\Users\Aluno\AppData\Local\Programs\Python\Python312\python.exe" -m pip install python-dotenv
```

Edite `lexabyte/settings.py` e adicione no topo:

```python
from dotenv import load_dotenv
load_dotenv()
```

---

## Importar Schema MySQL

### Opção 1: Via linha de comando

```bash
# CMD/PowerShell
mysql -u root -p lexabyte < lexabyte_mysql.sql

# Será solicitada a senha (deixe vazio se não tiver)
```

### Opção 2: Via phpMyAdmin (XAMPP)

1. Abra `http://localhost/phpmyadmin`
2. Crie banco: `CREATE DATABASE lexabyte CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
3. Vá em "SQL" e copie o conteúdo de `lexabyte_mysql.sql`
4. Execute

### Opção 3: Deixar Django criar (não recomendado para este projeto)

Django pode criar as tabelas via `migrate`, mas o schema MySQL tem particularidades. Preferencialmente, importe o SQL fornecido.

---

## Executar Migrations

Após configurar credenciais e importar o schema:

```powershell
cd "c:\Users\Aluno\Downloads\Lexabyte Back-End"

& "C:\Users\Aluno\AppData\Local\Programs\Python\Python312\python.exe" manage.py migrate
```

**Esperado:**
```
Operations to perform:
  Apply all migrations: admin, api, auth, contenttypes, sessions
Running migrations:
  Applying ... OK
  ...
```

---

## Popular Banco com Dados

Execute o script de seed para dados de teste:

```powershell
& "C:\Users\Aluno\AppData\Local\Programs\Python\Python312\python.exe" seed_mysql.py
```

**Criará:**
- 3 usuários de teste
- 6 conteúdos (livros, filmes, séries)
- Recomendações e relacionamentos

---

## Iniciar Servidor Django

```powershell
cd "c:\Users\Aluno\Downloads\Lexabyte Back-End"

& "C:\Users\Aluno\AppData\Local\Programs\Python\Python312\python.exe" manage.py runserver
```

Servidor rodará em: **http://127.0.0.1:8000/**

API disponível em: **http://127.0.0.1:8000/api/**

---

## Endpoints da API

### Listar conteúdos
```
GET http://127.0.0.1:8000/api/conteudos/
```

Resposta:
```json
[
  {
    "id_conteudo": 1,
    "tipo": "livro",
    "titulo": "Dom Casmurro",
    "descricao": "...",
    "capa_url": "...",
    "ano": 1899,
    "criado_em": "2026-05-08T..."
  },
  ...
]
```

### Listar usuários
```
GET http://127.0.0.1:8000/api/usuarios/
```

### Listar recomendações
```
GET http://127.0.0.1:8000/api/recomendacoes/
```

---

## Estrutura de Modelos

### Usuario
- `id_usuario` (PK)
- `nome` (max 100)
- `login` (único)
- `senha` (max 255 - hash)
- `email` (único, opcional)
- `criado_em` (timestamp)

### Conteudo
- `id_conteudo` (PK)
- `tipo` (livro, filme, série)
- `titulo` (max 255)
- `descricao` (text)
- `capa_url` (max 500, opcional)
- `ano` (optional)
- `criado_em` (timestamp)

### Recomendacao
- `id_recomendacao` (PK)
- `conteudo` (FK → Conteudo)
- `usuario` (FK → Usuario)
- `link` (max 500, opcional)
- `criado_em` (timestamp)

### UsuarioConteudo (M2M)
- `conteudo` (FK → Conteudo)
- `usuario` (FK → Usuario)
- `salvo_em` (timestamp)

---

## Compatibilidade

### Material (Legacy)
O modelo `Material` foi mantido para compatibilidade com a API existente. Está em tabela separada `material`.

Você pode:
- Continuar usando a API de `Material` como estava
- Migrar para usar `Conteudo` aos poucos
- Manter ambos em paralelo

---

## Troubleshooting

### "Can't connect to MySQL"
1. Verifique se MySQL está rodando
2. Teste credenciais com: `mysql -u root -p`
3. Confirme host/port em `.env`

### "Unknown database 'lexabyte'"
1. Crie o banco: `CREATE DATABASE lexabyte;`
2. Ou importe `lexabyte_mysql.sql`

### "No such table: conteudo"
1. Execute: `python manage.py migrate`
2. Ou importe `lexabyte_mysql.sql` novamente

### "AttributeError: 'MySQLdb._exceptions.Error'"
MySQL driver não instalado. Execute:
```powershell
& "C:\Users\Aluno\AppData\Local\Programs\Python\Python312\python.exe" -m pip install mysqlclient
```

### Voltar para SQLite
No `.env`, defina: `USE_SQLITE=true`

---

## Próximos Passos

1. ✅ Instalar driver MySQL
2. ✅ Configurar credenciais
3. ✅ Importar schema SQL
4. ✅ Executar migrate
5. ✅ Popular dados
6. 🔜 Criar serializers para novos modelos
7. 🔜 Ajustar URLs da API
8. 🔜 Testar endpoints frontend ↔ backend

---

## Referências

- [Django MySQL Backend Docs](https://docs.djangoproject.com/en/6.0/ref/databases/#mysql-notes)
- [mysqlclient Documentation](https://mysqlclient.readthedocs.io/)
- [Schema MySQL LexaByte](./lexabyte_mysql.sql)

---

**Integração MySQL em progresso!** ⏳
