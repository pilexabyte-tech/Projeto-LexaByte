# 📖 Guia de Documentação MySQL — LexaByte

## 🚀 Comece Aqui

### Para Quem Tem Pressa
👉 **[RESUMO_MYSQL.md](./RESUMO_MYSQL.md)** - 5 min de leitura

### Para Instalação Passo-a-Passo
👉 **[INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md)** - Checklist numerado

### Para Entender Tudo
👉 **[MYSQL_SETUP.md](./MYSQL_SETUP.md)** - Guia completo com troubleshooting

---

## 📋 Quick Scripts

```powershell
# Setup automático (instala dependências)
python quick_setup.py

# Seed dados de teste
python seed_mysql.py

# Migrations automático
python manage.py migrate

# Rodar servidor
python manage.py runserver
```

---

## 📊 Modelos de Dados

```
┌──────────────────┐
│     Usuario      │
├──────────────────┤
│ ID_Usuario (PK)  │
│ Nome             │
│ Login (UNIQUE)   │
│ Senha            │
│ Email (UNIQUE)   │
│ Criado_em        │
└──────────────────┘
        △
        │ (1:N)
        │
        ├─────────────────────┬─────────────────────┐
        │                     │                     │
┌──────────────────┐  ┌───────────────────┐  ┌────────────────────┐
│  Recomendacao    │  │ UsuarioConteudo   │  │    Conteudo        │
├──────────────────┤  ├───────────────────┤  ├────────────────────┤
│ ID (PK)          │  │ ID_Usuario (FK)   │  │ ID_Conteudo (PK)   │
│ ID_Usuario (FK)  │  │ ID_Conteudo (FK)  │  │ Tipo (enum)        │
│ ID_Conteudo (FK) │  │ Salvo_em          │  │ Titulo             │
│ Link             │  │                   │  │ Descricao          │
│ Criado_em        │  └───────────────────┘  │ Capa_URL           │
└──────────────────┘                         │ Ano                │
                                             │ Criado_em          │
                                             └────────────────────┘
```

---

## 🔌 Endpoints da API

### Conteúdos
```
GET    /api/conteudos/
POST   /api/conteudos/
GET    /api/conteudos/{id}/
PUT    /api/conteudos/{id}/
DELETE /api/conteudos/{id}/
```

### Usuários
```
GET    /api/usuarios/
POST   /api/usuarios/
GET    /api/usuarios/{id}/
PUT    /api/usuarios/{id}/
DELETE /api/usuarios/{id}/
```

### Recomendações
```
GET    /api/recomendacoes/
POST   /api/recomendacoes/
GET    /api/recomendacoes/{id}/
PUT    /api/recomendacoes/{id}/
DELETE /api/recomendacoes/{id}/
```

### Listas de Usuários
```
GET    /api/usuario-conteudo/
POST   /api/usuario-conteudo/
DELETE /api/usuario-conteudo/{id}/
```

### Legacy (Compatibilidade)
```
GET    /api/materiais/
POST   /api/materiais/
GET    /api/materiais/{id}/
PUT    /api/materiais/{id}/
DELETE /api/materiais/{id}/
```

---

## 📦 Arquivos Importantes

| Arquivo | Propósito |
|---------|-----------|
| **api/models.py** | Modelos Django (Usuario, Conteudo, etc.) |
| **api/views.py** | Endpoints API (ViewSets) |
| **api/serializers.py** | Serializers DRF |
| **api/urls.py** | Rotas da API |
| **lexabyte/settings.py** | Configuração Django + MySQL |
| **.env** | Credenciais MySQL (criar a partir de .env.example) |
| **requirements.txt** | Dependências Python |
| **lexabyte_mysql.sql** | Schema MySQL |
| **seed_mysql.py** | Popula dados de teste |
| **quick_setup.py** | Setup automático |

---

## 🎯 Ordem de Execução Recomendada

```
1. Ler RESUMO_MYSQL.md (entender o que foi feito)
2. Executar quick_setup.py (instalar deps)
3. Editar .env com credenciais
4. Criar banco: CREATE DATABASE lexabyte;
5. Importar SQL: mysql -u root lexabyte < lexabyte_mysql.sql
6. Rodar migrate: python manage.py migrate
7. Seed dados: python seed_mysql.py
8. Rodar servidor: python manage.py runserver
9. Testar: curl http://127.0.0.1:8000/api/conteudos/
```

---

## 💾 Dados de Teste (seed_mysql.py)

### Usuários
- João Silva (joao_silva)
- Maria Santos (maria_santos)
- Pedro Oliveira (pedro_oliveira)

### Conteúdos (Livros, Filmes, Séries)
1. Dom Casmurro (livro, 1899)
2. Grande Sertão: Veredas (livro, 1956)
3. Capitães da Areia (livro, 1937)
4. Cidade de Deus (filme, 2002)
5. Memórias Póstumas de Brás Cubas (filme, 1985)
6. Conversa com Bial (série, 2000)

---

## ✅ Checklist Rápido

- [ ] Ler RESUMO_MYSQL.md
- [ ] Executar quick_setup.py
- [ ] Editar .env
- [ ] Criar banco MySQL
- [ ] Importar lexabyte_mysql.sql
- [ ] python manage.py migrate
- [ ] python seed_mysql.py
- [ ] python manage.py runserver
- [ ] Testar /api/conteudos/ no navegador

---

## 🆘 Problemas Comuns

**"Can't connect to MySQL"**
→ MySQL não está rodando ou credenciais erradas em .env

**"Unknown database 'lexabyte'"**
→ Criar: `CREATE DATABASE lexabyte;`

**"No such table: conteudo"**
→ Rodar: `python manage.py migrate`

**"ModuleNotFoundError: MySQLdb"**
→ Rodar: `pip install mysqlclient`

**Mais ajuda?**
→ Ver MYSQL_SETUP.md seção "Troubleshooting"

---

## 📞 Próximas Fases

- [ ] Autenticação JWT
- [ ] Paginação de resultados
- [ ] Busca e filtros avançados
- [ ] Upload de capas
- [ ] Testes unitários
- [ ] Documentação Swagger

---

## 🎓 Recursos Adicionais

- [Django Docs - MySQL](https://docs.djangoproject.com/en/6.0/ref/databases/#mysql-notes)
- [DRF - Serializers](https://www.django-rest-framework.org/api-guide/serializers/)
- [mysqlclient Docs](https://mysqlclient.readthedocs.io/)

---

**Status: ✅ Backend MySQL Pronto**

Próximo: Executar setup e testar endpoints!
