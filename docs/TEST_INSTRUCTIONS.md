# LexaByte — Instruções de Teste da Funcionalidade de Visualização de Mídia

## Pré-requisitos

1. **Backend Django rodando**
   ```bash
   cd back/
   python manage.py runserver
   # Servidor rodará em http://127.0.0.1:8000
   ```

2. **Frontend acessível**
   - Abra `front/src/app.html` em um navegador
   - Ou use um servidor local: `python -m http.server 8080` na pasta `front/`

3. **Database com dados de teste**
   - Execute as migrações: `python manage.py migrate`
   - Crie dados de teste via admin ou shell

## 1. Criar Dados de Teste

### Via Django Admin

```bash
cd back/
python manage.py createsuperuser
python manage.py runserver
```

Acesse `http://127.0.0.1:8000/admin` e crie materiais com:
- **Título**: "Dom Casmurro"
- **Descrição**: "Uma das obras mais importantes da literatura brasileira"
- **Tipo**: "LIVRO"
- **Autor**: "Machado de Assis"
- **Link de Acesso**: `https://example.com/books/dom-casmurro`

### Via Shell Django

```bash
python manage.py shell

# Dentro do shell:
from api.models import Material

Material.objects.create(
    titulo="Dom Casmurro",
    descricao="Uma das obras mais importantes da literatura brasileira",
    tipo="LIVRO",
    autor_ou_criador="Machado de Assis",
    link_acesso="https://example.com/books/dom-casmurro"
)

Material.objects.create(
    titulo="Grande Sertão: Veredas",
    descricao="Obra monumental de Guimarães Rosa",
    tipo="LIVRO",
    autor_ou_criador="Guimarães Rosa",
    link_acesso="https://example.com/books/grande-sertao"
)
```

## 2. Testar o Endpoint de Busca

### Via cURL

```bash
# Buscar por link exato
curl "http://127.0.0.1:8000/api/materiais/buscar/por-link/?link_acesso=https://example.com/books/dom-casmurro"

# Busca parcial (qualquer URL que contenha "dom-casmurro")
curl "http://127.0.0.1:8000/api/materiais/buscar/por-link/?link_acesso=dom-casmurro"
```

### Resposta Esperada (Sucesso)

```json
[
  {
    "id": 1,
    "titulo": "Dom Casmurro",
    "descricao": "Uma das obras mais importantes da literatura brasileira",
    "tipo": "LIVRO",
    "autor_ou_criador": "Machado de Assis",
    "link_acesso": "https://example.com/books/dom-casmurro",
    "data_adicao": "2025-01-15T10:30:00Z"
  }
]
```

### Resposta Esperada (Erro - Link não encontrado)

```json
{
  "error": "Nenhum material encontrado com este link"
}
```

## 3. Testar o Frontend

### Via App HTML

1. Abra `front/src/app.html` em um navegador
2. Veja os cards sendo carregados com dados da API
3. Clique em qualquer card de material
4. O modal deve abrir mostrando:
   - Spinner de carregamento
   - Detalhes do material
   - Link para acessar o material

### Via Server Local

```bash
# Na pasta front/
python -m http.server 8080

# Acesse: http://localhost:8080/src/app.html
```

## 4. Cenários de Teste

### Cenário A: Fluxo Completo Bem-sucedido

**Passos:**
1. Abra `app.html`
2. Aguarde o carregamento dos cards
3. Clique em um card
4. Modal abre com spinner
5. Dados do material aparecem
6. Botão "Acessar Material" está clicável

**Verificar:**
- ✅ Modal aparece com animação suave
- ✅ Dados corretos são exibidos
- ✅ Link está íntegro (não alterado)
- ✅ ESC e click no backdrop fecham o modal

### Cenário B: Fechar Modal

**Passos:**
1. Abra um modal (clique em um card)
2. Teste diferentes formas de fechar:
   - Clique no botão ✕
   - Clique no backdrop escuro
   - Pressione ESC
   - Clique em "Fechar"

**Verificar:**
- ✅ Modal fecha suavemente
- ✅ Estado é resetado
- ✅ Pode abrir outro modal logo depois

### Cenário C: Dados Íntegros

**Passos:**
1. Adicione material com link contendo caracteres especiais:
   ```
   https://example.com/media?id=123&format=pdf&lang=pt-BR
   ```
2. Clique no card
3. Verifique no Network tab do DevTools

**Verificar:**
- ✅ Link na URL está encodificado corretamente
- ✅ Dados retornados correspondem ao link
- ✅ Link no modal é clicável e íntegro

### Cenário D: Erro - Link não Encontrado

**Passos:**
1. Vá ao DevTools → Console
2. Execute:
   ```javascript
   const modal = new Modal('test-modal');
   modal.open('https://example.com/nonexistent');
   ```

**Verificar:**
- ✅ Spinner aparece
- ✅ Após 2-3 segundos, mensagem de erro
- ✅ Botão "Tentar novamente" está disponível
- ✅ Console não tem erros críticos

### Cenário E: Múltiplas Aberturas

**Passos:**
1. Abra um modal
2. Feche-o
3. Abra outro
4. Feche-o
5. Repita 5-6 vezes

**Verificar:**
- ✅ Sem memory leaks
- ✅ State gerenciado corretamente
- ✅ Sem duplicação de elementos no DOM

### Cenário F: Acessibilidade

**Passos:**
1. Navegue apenas com teclado:
   - Tab para focar em elementos
   - Enter para clicar
   - ESC para fechar
2. Use leitor de tela (NVDA/JAWS no Windows, VoiceOver no Mac)

**Verificar:**
- ✅ Elementos focáveis têm outline visível
- ✅ Modal tem aria-labelledby correto
- ✅ Mensagens de carregamento são anunciadas
- ✅ Erro é anunciado com role="alert"

## 5. Usando o Console do Navegador

### Teste Rápido

```javascript
// Abrir DevTools (F12 ou Cmd+Option+I)

// Criar modal e testá-lo
const modal = new Modal('test-modal');

// Abrir com link válido
modal.open('https://example.com/books/dom-casmurro');

// Verificar estado
console.log(ModalState.isOpen);        // true
console.log(ModalState.currentData);   // 'LOADING' ou dados

// Aguardar um segundo e fechar
setTimeout(() => modal.close(), 1000);

// Testar ImageComponent
const img = new ImageComponent({
  src: 'https://via.placeholder.com/200',
  alt: 'Teste',
  mediaLink: 'https://example.com/test',
  modal: modal
});
document.body.appendChild(img.render());
```

## 6. Verificar Network

1. Abra DevTools → Network
2. Clique em um card
3. Veja a requisição:
   ```
   GET /api/materiais/buscar/por-link/?link_acesso=...
   Status: 200 ou 404
   Response: JSON com dados ou erro
   ```

**Verificar:**
- ✅ Status 200 para sucesso
- ✅ Status 404 para não encontrado
- ✅ Response é JSON válido
- ✅ Sem CORS errors

## 7. Debugging

### Se o modal não abre

```javascript
// Verificar se components.js foi carregado
console.log(typeof Modal);           // "function"
console.log(typeof ImageComponent);  // "function"
console.log(typeof ModalState);      // "object"

// Verificar se está no DOM
console.log(document.getElementById('app-modal')); // HTMLElement ou null
```

### Se a requisição falha

```javascript
// Testar fetch manualmente
fetch('http://127.0.0.1:8000/api/materiais/buscar/por-link/?link_acesso=test')
  .then(r => {
    console.log('Status:', r.status);
    return r.json();
  })
  .then(data => console.log('Data:', data))
  .catch(err => console.error('Erro:', err));
```

### Se há erro CORS

```javascript
// Verificar resposta do backend
// A resposta deve incluir headers:
// Access-Control-Allow-Origin: *
// ou seu domínio específico
```

## 8. Checklist Final

- [ ] Backend Django rodando sem erros
- [ ] Frontend carrega sem erros no console
- [ ] Materiais são criados com sucesso
- [ ] Endpoint `/api/materiais/buscar/por-link/` retorna dados
- [ ] Cards carregam com dados da API
- [ ] Clicar em card abre modal
- [ ] Modal mostra spinner enquanto carrega
- [ ] Dados do material aparecem corretamente
- [ ] Link está íntegro (não alterado)
- [ ] Modal fecha com ESC, backdrop e botão fechar
- [ ] Sem erros no console
- [ ] Sem erros CORS
- [ ] State do modal é gerenciado corretamente
- [ ] Múltiplas aberturas funcionam sem problema
- [ ] Acessibilidade ok (navegação por teclado)

## 9. Problema Comum e Soluções

### "Cannot GET /api/materiais/buscar/por-link/"

**Causa:** Rota não foi adicionada corretamente
**Solução:** Verifique se `urls.py` tem o path correto

```python
path('materiais/buscar/por-link/', search_by_link, name='search-by-link'),
```

### "Nenhum material encontrado"

**Causa:** Não há materiais com esse link no DB
**Solução:** Crie materiais de teste via admin

### Modal não abre

**Causa:** `components.js` não foi carregado
**Solução:** Verifique se `<script src="js/components.js"></script>` está em `app.html`

### CORS Error

**Causa:** Backend não permite origem do frontend
**Solução:** Verifique `CORS_ALLOWED_ORIGINS` em `settings.py`

## 10. Melhorias Futuras

- [ ] Adicionar preview de imagem no modal
- [ ] Implementar paginação para múltiplos resultados
- [ ] Adicionar cache no frontend
- [ ] Implementar testes unitários
- [ ] Otimizar performance com lazy loading
