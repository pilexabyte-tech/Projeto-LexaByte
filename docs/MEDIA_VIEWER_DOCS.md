# LexaByte — Documentação Unificada de Visualização de Mídia

## Visão Geral

A funcionalidade de visualização de mídia combina backend e frontend para permitir que o usuário abra um modal com detalhes do material ao clicar em uma imagem ou card.

### Componentes principais
- **Endpoint backend**: `/api/materiais/buscar/por-link/`
- **Frontend**: `ImageComponent`, `Modal` e `ModalState`
- **Pasta**: `docs`

---

## Arquitetura

### Backend
- Novo endpoint em `back/api/views.py`
- Rota adicionada em `back/api/urls.py`
- Busca `link_acesso` em `Material`
- Resposta JSON com materiais ou erro 404

### Frontend
- `front/src/js/components.js`
  - `Modal`
  - `ImageComponent`
  - `ModalState`
- `front/src/app.html`
  - Inclui `components.js`
- `front/src/js/app.js`
  - Integra clique nos cards com abertura do modal
- `front/src/css/app.css`
  - Estilos do modal e estados de carregamento/erro

---

## Uso do endpoint

### Requisição
```http
GET /api/materiais/buscar/por-link/?link_acesso=<url>
```

### Parâmetro
- `link_acesso`: URL ou texto parcial para buscar materiais

### Respostas
- `200`: array de materiais
- `404`: material não encontrado
- `400`: parâmetro ausente ou inválido

---

## Como funciona

1. Usuário clica em um `ImageComponent`
2. `Modal.open(mediaLink)` é chamado
3. `ModalState` entra em loading
4. Frontend faz `fetch` para o backend
5. Backend retorna material ou erro
6. Modal exibe conteúdo, spinner ou mensagem de erro

---

## Estrutura de dados

### Material
- `id`
- `titulo`
- `descricao`
- `tipo`
- `autor_ou_criador`
- `link_acesso`
- `data_adicao`

---

## Acessibilidade
- Fechar com `ESC`
- Clique no backdrop fecha o modal
- `role="button"` nas imagens clicáveis
- `role="dialog"` no modal
- Outline visível no foco
- Mensagens de erro anunciadas

---

## Segurança
- Escape de HTML antes de inserir no DOM
- `encodeURIComponent` em valores de URL
- Validação do parâmetro `link_acesso` no backend

---

## Como testar

### Preparação
1. Rodar backend Django: `python manage.py runserver`
2. Abrir `front/src/app.html` ou servir `front/` localmente
3. Criar materiais no Django admin ou shell

### Testes básicos
- Abrir `app.html`
- Clicar em um card
- Verificar modal
- Verificar link clicável
- Fechar com ESC, botão ou backdrop

### Testes de API
- `curl "http://127.0.0.1:8000/api/materiais/buscar/por-link/?link_acesso=dom-casmurro"`
- Verificar retorno 200 com material correto
- Verificar 404 para link inexistente

---

## Cenários de verificação

- Fluxo completo bem-sucedido
- Erro de link não encontrado
- Erro de rede ou backend
- Múltiplas aberturas de modal
- Navegação por teclado

---

## Melhorias futuras
- Preview de imagem real no modal
- Paginação de resultados
- Filtros avançados de busca
- Cache no frontend
- Testes unitários

---

## Conclusão

É possível resumir `CHANGES_SUMMARY.md`, `MEDIA_COMPONENT_USAGE.md` e `TEST_INSTRUCTIONS.md` em um único documento unificado. O arquivo consolidado está em `docs/MEDIA_VIEWER_DOCS.md`.
