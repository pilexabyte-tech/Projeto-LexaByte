# 🚀 Guia de Inicialização - LexaByte (Front-end + Back-end)

## Status da Integração

✅ **Python 3.12** instalado  
✅ **Django 6.0.5** com DRF e CORS configurados  
✅ **Servidor Back-end** rodando em `http://127.0.0.1:8000/`  
✅ **Servidor Front-end** rodando em `http://127.0.0.1:5500/`  
✅ **Banco de dados** SQLite com dados de teste populados  
✅ **Integração API** funcionando corretamente (fetch de materiais carregando na página)

---

## Como Iniciar

### Terminal 1: Backend (Django)

```powershell
cd "c:\Users\Aluno\Downloads\Lexabyte Back-End"
& "C:\Users\Aluno\AppData\Local\Programs\Python\Python312\python.exe" manage.py runserver
```

O servidor estará disponível em: **http://127.0.0.1:8000/**

#### Endpoints da API:
- `GET http://127.0.0.1:8000/api/materiais/` - Listar todos os materiais
- `POST http://127.0.0.1:8000/api/materiais/` - Criar novo material
- `GET http://127.0.0.1:8000/api/materiais/<id>/` - Detalhe de um material
- `PUT/PATCH http://127.0.0.1:8000/api/materiais/<id>/` - Atualizar material
- `DELETE http://127.0.0.1:8000/api/materiais/<id>/` - Deletar material

---

### Terminal 2: Frontend (Servidor HTTP)

```powershell
cd "c:\Users\Aluno\Downloads\Lexabyte Back-End"
& "C:\Users\Aluno\AppData\Local\Programs\Python\Python312\python.exe" serve_frontend.py
```

O servidor estará disponível em: **http://127.0.0.1:5500/**

Acesse: **http://127.0.0.1:5500/index.html**

---

## Configuração

### Dependências Instaladas

```
django==6.0.5
djangorestframework==3.17.1
django-cors-headers==4.9.0
```

Arquivo de dependências salvo em: `requirements.txt`

### CORS Configurado

O backend permite requisições dos seguintes origins:
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `http://localhost:5500`
- `http://127.0.0.1:5500`
- `http://localhost:8080`
- `http://127.0.0.1:8080`

---

## Dados de Teste

O banco foi populado com 5 materiais de teste:

1. **Introdução ao Python** (Livro) - Mark Lutz
2. **Programação Web com Django** (Curso) - Real Python
3. **REST APIs Best Practices** (Artigo) - Roy Fielding
4. **JavaScript Para Todos** (Vídeo) - Wes Bos
5. **Docker e Containerização** (Livro) - John Doe

Para recriar os dados, execute:

```powershell
& "C:\Users\Aluno\AppData\Local\Programs\Python\Python312\python.exe" seed_data.py
```

---

## Próximas Etapas

### Banco de Dados
- [ ] Migrar de SQLite para MySQL/MariaDB
- [ ] Mapear dados existentes (`lexabyte.sql`) para modelo Django
- [ ] Configurar credentials de acesso ao banco

### Backend Melhorias
- [ ] Implementar autenticação de usuários
- [ ] Adicionar paginação à API
- [ ] Implementar filtros e busca
- [ ] Adicionar validação de dados

### Frontend Melhorias
- [ ] Refatorar para React
- [ ] Implementar modal de detalhes com dados da API
- [ ] Adicionar busca em tempo real
- [ ] Melhorar responsividade

---

## Estrutura de Diretórios

```
Lexabyte Back-End/
├── manage.py              # CLI Django
├── requirements.txt       # Dependências Python
├── seed_data.py          # Script para popular dados teste
├── serve_frontend.py     # Servidor HTTP para frontend
├── api/                  # App Django com models e serializers
│   ├── models.py         # Modelo Material
│   ├── views.py          # Endpoints API
│   ├── serializers.py    # Serializador para Material
│   ├── urls.py           # Rotas da API
│   └── ...
├── lexabyte/             # Configuração do Django
│   ├── settings.py       # CORS e INSTALLED_APPS
│   ├── urls.py           # URLs raiz
│   └── ...
├── templates/
├── db.sqlite3            # Banco de dados local
└── venv/                 # Ambiente virtual (opcional)

Projeto-LexaByte/
├── front/
│   └── src/
│       ├── index.html    # Página inicial
│       ├── app.html      # Biblioteca (faz fetch na API)
│       ├── login.html    # Página de login
│       ├── Team.html     # Equipe
│       ├── js/
│       │   ├── app.js    # Integração com API
│       │   ├── index.js  # Landing page logic
│       │   ├── login.js  # Tab switching
│       │   └── ...
│       └── css/
│           └── ...
├── docs/
├── back/                 # (Vazio - usar Lexabyte Back-End)
├── README.md
└── LICENSE
```

---

## Troubleshooting

### Python não encontrado
Se o Python não estiver no PATH, use o caminho completo:
```powershell
"C:\Users\Aluno\AppData\Local\Programs\Python\Python312\python.exe"
```

### CORS bloqueando requisições
Verifique se o origin da página está em `CORS_ALLOWED_ORIGINS` em `lexabyte/settings.py`

### Porta já em uso
Modifique `serve_frontend.py` ou `manage.py runserver 8001` para usar outra porta

### Banco sem dados
Execute o script de seed:
```powershell
& "C:\Users\Aluno\AppData\Local\Programs\Python\Python312\python.exe" seed_data.py
```

---

## API Reference

### GET /api/materiais/
Retorna lista de todos os materiais

**Response:**
```json
[
  {
    "id": 1,
    "titulo": "Introdução ao Python",
    "descricao": "Um guia completo para iniciantes em Python",
    "tipo": "LIVRO",
    "autor_ou_criador": "Mark Lutz",
    "link_acesso": "https://exemplo.com/python-intro",
    "data_adicao": "2026-05-08T19:21:06Z"
  },
  ...
]
```

---

**Integração completa e funcional! ✅**
