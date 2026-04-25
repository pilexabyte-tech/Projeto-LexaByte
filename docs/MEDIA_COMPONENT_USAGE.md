# LexaByte — Media Viewer Component

## Visão Geral

A funcionalidade de visualização de mídia foi restaurada com dois componentes principais:
- **ImageComponent**: Componente reutilizável para exibir imagens clicáveis
- **Modal**: Componente para exibir detalhes de materiais em um modal interativo

## Arquitetura

### Backend (Python/Django)

#### Novo Endpoint
- **URL**: `/api/materiais/buscar/por-link/`
- **Método**: GET
- **Parâmetro**: `link_acesso` (URL ou string para busca)
- **Resposta**: Array de materiais encontrados ou erro 404

```python
# Exemplo de requisição
GET http://127.0.0.1:8000/api/materiais/buscar/por-link/?link_acesso=https://example.com/media
```

#### Response
```json
[
  {
    "id": 1,
    "titulo": "Dom Casmurro",
    "descricao": "Uma das obras mais importantes...",
    "tipo": "LIVRO",
    "autor_ou_criador": "Machado de Assis",
    "link_acesso": "https://example.com/media",
    "data_adicao": "2025-01-15T10:30:00Z"
  }
]
```

### Frontend (Vanilla JavaScript)

#### 1. Modal Component

O Modal gerencia a exibição de detalhes de materiais em um overlay modal com:
- Estado gerenciado via `ModalState`
- Carregamento assíncrono de dados
- Tratamento de erros
- Acessibilidade (ARIA, teclado)

**Uso básico:**

```javascript
// Inicializar o Modal
const modal = new Modal('app-modal');

// Abrir modal com link de mídia
modal.open('https://example.com/media');

// O modal automaticamente:
// 1. Busca o material pelo link no backend
// 2. Exibe um spinner enquanto carrega
// 3. Renderiza os detalhes do material
// 4. Permite fechar com ESC, click no backdrop ou botão de fechar
```

**Estados do Modal:**

- **Loading**: Spinner enquanto busca dados
- **Content**: Dados do material exibidos
- **Error**: Mensagem de erro com opção de tentar novamente

#### 2. ImageComponent

Componente flexível para exibir imagens com integração automática ao Modal.

**Uso básico:**

```javascript
// Criar um ImageComponent
const imageComponent = new ImageComponent({
  id: 'hero-image',
  src: 'path/to/image.jpg',
  alt: 'Descrição da imagem',
  title: 'Título',
  mediaLink: 'https://example.com/media', // Link para busca
  modal: modal, // Passar instância do Modal
  className: 'custom-class'
});

// Renderizar no DOM
imageComponent.render();

// Ou montar diretamente em um elemento pai
imageComponent.mount('.image-container');
```

**Propriedades:**

```javascript
{
  id: string,                    // ID único (gerado automaticamente se não fornecido)
  src: string,                   // URL da imagem
  alt: string,                   // Texto alternativo
  title: string,                 // Tooltip da imagem
  mediaLink: string,             // Link para busca no backend
  onClick: function,             // Callback customizado (opcional)
  modal: Modal,                  // Instância do Modal
  className: string              // Classes CSS customizadas
}
```

## Exemplo Completo

### HTML
```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="css/app.css">
</head>
<body>
  <div id="image-container"></div>
  
  <script src="js/components.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

### JavaScript
```javascript
// Inicializar Modal
const modal = new Modal('app-modal');

// Criar ImageComponent
const heroImage = new ImageComponent({
  src: 'images/dom-casmurro.jpg',
  alt: 'Capa de Dom Casmurro',
  title: 'Clique para mais informações',
  mediaLink: 'https://example.com/media/dom-casmurro',
  modal: modal,
  className: 'hero-image'
});

// Renderizar e montar no DOM
heroImage.mount('#image-container');
```

## Fluxo de Funcionamento

```
┌─────────────────┐
│  ImageComponent │
│   (Clique)      │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ Modal.open(mediaLink)       │
│ ModalState.setLoading()     │
│ Exibe spinner               │
└────────┬────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ fetch(/api/materiais/buscar/...)   │
│ Passa link_acesso como parâmetro   │
└────────┬─────────────────────────────┘
         │
    ┌────┴─────┐
    ▼          ▼
┌────────┐  ┌────────┐
│ Sucesso│  │ Erro   │
└────┬───┘  └───┬────┘
     │          │
     ▼          ▼
┌─────────┐  ┌───────────┐
│ Renderiza│ │Exibe erro │
│ Material │ │com botão  │
│          │ │retry      │
└──────────┘ └───────────┘
```

## Gerenciamento de Estado

O `ModalState` gerencia o estado global do modal:

```javascript
ModalState.isOpen;          // boolean
ModalState.currentData;     // Material object ou null
ModalState.open(data);      // Abre modal com dados
ModalState.close();         // Fecha modal
ModalState.isLoading();     // Verifica se está carregando
ModalState.setLoading();    // Define estado de carregamento
```

## Segurança e Integridade de Dados

### 1. Escape de HTML
Todos os dados do usuário são escapados antes de serem inseridos no DOM:
```javascript
const div = document.createElement('div');
div.textContent = userInput;  // Previne XSS
return div.innerHTML;
```

### 2. URL Encoding
O link é encodificado na URL de requisição:
```javascript
const url = `/api/materiais/buscar/por-link/?link_acesso=${encodeURIComponent(mediaLink)}`;
```

### 3. Validação no Backend
```python
# O endpoint valida o parâmetro link_acesso
if not link_param:
    return Response({'error': '...'}, status=400)
```

## Acessibilidade

### ImageComponent
- Suporta navegação por teclado (Tab, Enter, Space)
- Role de button para imagens clicáveis
- Outline visível no focus

### Modal
- Aria labels para elementos interativos
- Suporta fechar com ESC
- Aria live regions para estados de carregamento
- Contraste de cores adequado

## Estilos CSS

Os estilos estão em `css/app.css` com os seguintes seletores principais:

```css
.image-component                /* Container da imagem */
.image-component-img.clickable  /* Imagem clicável com hover */
#app-modal                       /* Container do modal */
.modal                           /* Modal principal */
.modal-backdrop                  /* Fundo escuro */
.modal-loading                   /* Estado de carregamento */
.modal-error                     /* Estado de erro */
.modal-material                  /* Conteúdo do material */
```

## Tratamento de Erros

### Cenários Tratados

1. **Link não encontrado no backend**
   - Status: 404
   - Mensagem: "Material não encontrado com este link"
   - Botão "Tentar novamente"

2. **Erro na requisição**
   - Status: Qualquer erro HTTP
   - Mensagem: "Erro ao carregar material"
   - Stack trace no console

3. **Falha de rede**
   - Capturada no catch da Promise
   - Mensagem amigável para o usuário

## Responsividade

O design é totalmente responsivo:
- Desktop: Modal normal com máximo de 500px
- Tablet: Modal adapta a largura
- Mobile: Modal ocupa 95% da largura com padding reduzido

## Performance

- Imagens com lazy loading via `object-fit: cover`
- Modal com animação suave (transform e opacity)
- Sem re-renders desnecessários
- Código otimizado para vanilla JS

## Compatibilidade

- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Suporte a CORS configurado no backend Django
- Não requer dependências externas

## Próximas Melhorias

- [ ] Suporte a imagens reais (não apenas placeholders)
- [ ] Preview de imagem no modal
- [ ] Paginação para múltiplos materiais encontrados
- [ ] Filtros avançados na busca
- [ ] Cache de requisições no frontend
- [ ] Animações customizadas
