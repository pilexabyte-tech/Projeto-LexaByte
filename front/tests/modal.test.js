const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

function loadFiles() {
  const base = path.join(__dirname, '..');
  const appHtml = fs.readFileSync(path.join(base, 'src', 'app.html'), 'utf8');
  const apiJs = fs.readFileSync(path.join(base, 'src', 'js', 'api.js'), 'utf8');
  const componentsJs = fs.readFileSync(path.join(base, 'src', 'js', 'components.js'), 'utf8');
  const appJs = fs.readFileSync(path.join(base, 'src', 'js', 'app.js'), 'utf8');

  // Inject scripts inline so JSDOM executes them
  const withoutExternalAssets = appHtml
    .replace(/<link rel="stylesheet" href="css\/[^"]+">\s*/g, '')
    .replace(/<script src="js\/[^"]+"><\/script>\s*/g, '');
  const injected = withoutExternalAssets.replace('</body>', `<script>${apiJs}</script><script>${componentsJs}</script><script>${appJs}</script></body>`);
  return injected;
}

function createDom() {
  const html = loadFiles();
  const dom = new JSDOM(html, {
    url: 'http://localhost/',
    runScripts: 'dangerously',
    resources: 'usable',
    beforeParse(window) {
      // Minimal IntersectionObserver polyfill for the window
      if (typeof window.IntersectionObserver === 'undefined') {
        class IntersectionObserverMock {
          constructor(cb) { this._cb = cb; }
          observe() {}
          unobserve() {}
          disconnect() {}
        }
        window.IntersectionObserver = IntersectionObserverMock;
      }

      // Provide a fallback fetch to the JSDOM window before app.js executes.
      // This prevents the app from attempting real network requests during tests.
      window.fetch = async () => ({
        ok: true,
        json: async () => []
      });
    }
  });

  return dom;
}

test('Banner "Acessar" abre modal com dados de Dom Casmurro', (done) => {
  const dom = createDom();
  const { window } = dom;

  // Allow scripts to initialize
  setTimeout(() => {
    const btn = window.document.querySelector('.featured .btn-watch[data-modal-open]');
    expect(btn).not.toBeNull();

    // Simula clique
    btn.click();

    const modalContainer = window.document.getElementById('app-modal');
    expect(modalContainer).not.toBeNull();

    // O handler que adicionamos no app.js adiciona a classe 'open' ao container
    expect(modalContainer.classList.contains('open')).toBe(true);

    // Conteúdo do modal deve incluir o título 'Dom Casmurro'
    const inner = modalContainer.innerHTML;
    expect(inner).toMatch(/Dom Casmurro/);

    // Não deve existir o modal estático obsoleto
    const legacy = window.document.getElementById('content-modal');
    expect(legacy).toBeNull();

    done();
  }, 100);
});

test('Navegação alterna entre as páginas de conteúdo', () => {
  const dom = createDom();
  const { window } = dom;

  const filmesLink = window.document.querySelector('.nav-links [data-page-link="filmes"]');
  expect(filmesLink).not.toBeNull();

  filmesLink.click();

  const filmesSection = window.document.querySelector('[data-page-section="filmes"]');
  const homeSection = window.document.querySelector('[data-page-section="home"]');

  expect(filmesSection.hidden).toBe(false);
  expect(homeSection.hidden).toBe(true);
  expect(filmesLink.classList.contains('active')).toBe(true);
});

test('Modal.showContent renderiza corretamente um material fornecido', () => {
  const dom = createDom();
  const { window } = dom;

  // Cria instância de modal isolada
  const modal = new window.Modal('test-modal');
  const sample = {
    titulo: 'Teste Título',
    tipo: 'livro',
    autor_ou_criador: 'Autor X',
    descricao: 'Descrição breve',
    data_adicao: '2025-01-01',
    link_acesso: ''
  };

  modal.showContent(sample);

  const container = window.document.getElementById('test-modal');
  expect(container).not.toBeNull();
  const inner = container.innerHTML;
  expect(inner).toMatch(/Teste Título/);
  expect(inner).toMatch(/Autor X/);
  expect(inner).toMatch(/Descrição breve/);
});

test('loadConteudos distribui conteúdos nas páginas de início e categorias', async () => {
  const dom = createDom();
  const { window } = dom;

  // Mock da API retornando 8 itens
  const materials = Array.from({ length: 8 }).map((_, i) => ({
    titulo: `Titulo ${i}`,
    tipo: 'livro',
    autor_ou_criador: `Autor ${i}`,
    descricao: `Desc ${i}`,
    link_acesso: ''
  }));

  window.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => materials });

  // Chama a função definida em app.js
  await window.loadMaterials();

  const alta = window.document.getElementById('alta-cards');
  const classicos = window.document.getElementById('classicos-cards');
  const filmes = window.document.getElementById('filmes-cards');
  const series = window.document.getElementById('series-cards');
  const livros = window.document.getElementById('livros-cards');

  expect(alta).not.toBeNull();
  expect(alta.querySelectorAll('.card').length).toBe(5);
  expect(classicos).not.toBeNull();
  expect(classicos.querySelectorAll('.card').length).toBe(5);
  expect(filmes.querySelectorAll('.card').length).toBe(0);
  expect(series.querySelectorAll('.card').length).toBe(0);
  expect(livros.querySelectorAll('.card').length).toBe(5);
});

test('seedDemoConteudos cria 15 conteúdos usando a API de criação', async () => {
  const dom = createDom();
  const { window } = dom;

  window.sessionStorage.setItem('authToken', 'token_1');
  window.sessionStorage.setItem('user', JSON.stringify({ id: 1, nome: 'Admin', username: 'admin', is_admin: true }));

  const created = [];
  window.fetch = jest.fn().mockImplementation(async (url, options = {}) => {
    if (String(url).includes('/conteudos/') && options.method === 'POST') {
      const payload = JSON.parse(options.body);
      const conteudo = {
        id_conteudo: created.length + 1,
        ...payload,
        criado_em: '2026-01-01T00:00:00.000Z',
      };
      created.push(conteudo);
      return { ok: true, json: async () => conteudo };
    }

    if (String(url).includes('/conteudos/')) {
      return { ok: true, json: async () => created };
    }

    return { ok: true, json: async () => [] };
  });

  const result = await window.seedDemoConteudos({ force: true });

  expect(result.success).toBe(true);
  expect(result.created).toBe(15);
  expect(created.length).toBe(15);
  expect(window.document.getElementById('filmes-cards').querySelectorAll('.card').length).toBe(5);
  expect(window.document.getElementById('series-cards').querySelectorAll('.card').length).toBe(5);
  expect(window.document.getElementById('livros-cards').querySelectorAll('.card').length).toBe(5);
});
