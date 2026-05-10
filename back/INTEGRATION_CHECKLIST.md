# 📋 Checklist de Integração MySQL — LexaByte

## ✅ Completado

- [x] Modelos Django criados (Usuario, Conteudo, Recomendacao, UsuarioConteudo)
- [x] Serializers DRF para todos os modelos
- [x] Views/Endpoints para CRUD completo
- [x] URLs da API estruturadas
- [x] settings.py configurado para MySQL
- [x] requirements.txt atualizado
- [x] Schema SQL fornecido
- [x] Scripts de seed (seed_mysql.py)
- [x] Documentação MySQL (MYSQL_SETUP.md)

---

## ⏳ Próximos Passos (Usuário Executa)

### 1️⃣ Instalar Driver MySQL

```powershell
cd "c:\Users\Aluno\Downloads\Lexabyte Back-End"
& "C:\Users\Aluno\AppData\Local\Programs\Python\Python312\python.exe" -m pip install mysqlclient==2.2.0
```

Se falhar, tente:
```powershell
& "C:\Users\Aluno\AppData\Local\Programs\Python\Python312\python.exe" -m pip install mysql-connector-python
```

---

### 2️⃣ Configurar Credenciais

Crie arquivo `.env` (copie de `.env.example`):

```
DB_NAME=lexabyte
DB_USER=root
DB_PASSWORD=
DB_HOST=127.0.0.1
DB_PORT=3306
USE_SQLITE=false
```

---

### 3️⃣ Criar Banco de Dados no MySQL

Abra MySQL/MariaDB e execute:

```sql
CREATE DATABASE lexabyte CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### 4️⃣ Importar Schema SQL

No PowerShell (no diretório backend):

```powershell
# Com senha
mysql -u root -p lexabyte < lexabyte_mysql.sql

# Sem senha (padrão XAMPP)
mysql -u root lexabyte < lexabyte_mysql.sql
```

Ou via phpMyAdmin:
- Acesse `http://localhost/phpmyadmin`
- Selecione banco `lexabyte`
- Vá em "SQL" → copie conteúdo de `lexabyte_mysql.sql` → Execute

---

### 5️⃣ Executar Migrations Django

```powershell
cd "c:\Users\Aluno\Downloads\Lexabyte Back-End"

& "C:\Users\Aluno\AppData\Local\Programs\Python\Python312\python.exe" manage.py migrate
```

---

### 6️⃣ Popular Banco com Dados de Teste

```powershell
& "C:\Users\Aluno\AppData\Local\Programs\Python\Python312\python.exe" seed_mysql.py
```

**Criará:**
- 3 usuários
- 6 conteúdos
- Relacionamentos

---

### 7️⃣ Iniciar Servidor

**Terminal 1 - Backend:**
```powershell
& "C:\Users\Aluno\AppData\Local\Programs\Python\Python312\python.exe" manage.py runserver
```

**Terminal 2 - Frontend:**
```powershell
& "C:\Users\Aluno\AppData\Local\Programs\Python\Python312\python.exe" serve_frontend.py
```

---

### 8️⃣ Testar Endpoints

Acesse em seu navegador ou curl:

```bash
# Listar conteúdos
curl http://127.0.0.1:8000/api/conteudos/

# Listar usuários
curl http://127.0.0.1:8000/api/usuarios/

# Listar recomendações
curl http://127.0.0.1:8000/api/recomendacoes/

# Listar listas de usuários
curl http://127.0.0.1:8000/api/usuario-conteudo/

# Material (legacy)
curl http://127.0.0.1:8000/api/materiais/
```

---

## 📊 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/conteudos/` | Listar conteúdos |
| POST | `/api/conteudos/` | Criar conteúdo |
| GET | `/api/conteudos/<id>/` | Detalhe de conteúdo |
| PUT | `/api/conteudos/<id>/` | Atualizar conteúdo |
| DELETE | `/api/conteudos/<id>/` | Deletar conteúdo |
| GET | `/api/usuarios/` | Listar usuários |
| POST | `/api/usuarios/` | Criar usuário |
| GET | `/api/recomendacoes/` | Listar recomendações |
| POST | `/api/recomendacoes/` | Criar recomendação |
| GET | `/api/usuario-conteudo/` | Listar listas de usuários |
| POST | `/api/usuario-conteudo/` | Adicionar à lista |
| GET | `/api/materiais/` | Listar materiais (legacy) |

---

## 🐛 Se der erro...

### "Can't connect to MySQL server"
1. Certifique-se que MySQL está rodando
2. Verifique credenciais em `.env`
3. Teste: `mysql -u root -p` (se pedir senha, deixe vazia para padrão)

### "Unknown database 'lexabyte'"
```sql
CREATE DATABASE lexabyte CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### "No such table: conteudo"
Execute:
```powershell
& "C:\Users\Aluno\AppData\Local\Programs\Python\Python312\python.exe" manage.py migrate
```

### "ImportError: No module named 'MySQLdb'"
```powershell
& "C:\Users\Aluno\AppData\Local\Programs\Python\Python312\python.exe" -m pip install mysqlclient
```

### Usar SQLite novamente
No `.env`, mude: `USE_SQLITE=true`

---

## 📁 Arquivos Importantes

```
Lexabyte Back-End/
├── .env.example                # Template de configuração
├── .env                        # ⚙️ EDITAR COM SUAS CREDENCIAIS
├── requirements.txt            # Dependências Python
├── MYSQL_SETUP.md             # Guia MySQL detalhado
├── SETUP_GUIDE.md             # Guia geral de setup
├── lexabyte_mysql.sql         # Schema MySQL
├── seed_mysql.py              # Script de seed
├── setup_mysql.py             # Script de setup automático
├── api/
│   ├── models.py              # ✅ Novo: Usuario, Conteudo, etc.
│   ├── views.py               # ✅ Novo: Endpoints MySQL
│   ├── serializers.py         # ✅ Novo: Serializers
│   └── urls.py                # ✅ Novo: Rotas
├── lexabyte/
│   └── settings.py            # ✅ Configurado para MySQL
└── manage.py
```

---

## 🚀 Ordem Recomendada

1. Instalar driver MySQL
2. Configurar `.env`
3. Criar banco e importar SQL
4. Rodar migrate
5. Rodar seed
6. Iniciar servidor
7. Testar endpoints
8. Testar integração frontend ↔ API

---

## ✨ Próxima Fase

- [ ] Implementar autenticação JWT
- [ ] Adicionar paginação
- [ ] Implementar busca e filtros avançados
- [ ] Validação de dados mais robusta
- [ ] Testes unitários
- [ ] Documentação Swagger/OpenAPI

---

**Status: ✅ Backend pronto para MySQL!**

Execute `.env` + `migrate` + `seed_mysql.py` para começar.
