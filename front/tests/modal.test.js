const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

function loadFiles() {
  const base = path.join(__dirname, '..');
  const appHtml = fs.readFileSync(path.join(base, 'src', 'app.html'), 'utf8');
  const componentsJs = fs.readFileSync(path.join(base, 'src', 'js', 'components.js'), 'utf8');
  const appJs = fs.readFileSync(path.join(base, 'src', 'js', 'app.js'), 'utf8');

  // Inject scripts inline so JSDOM executes them
  const injected = appHtml.replace('</body>', `<script>${componentsJs}</script><script>${appJs}</script></body>`);
  return injected;
}

function createDom() {
  const html = loadFiles();
  const dom = new JSDOM(html, {
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

test('loadMaterials distribui materiais entre #alta-cards e #classicos-cards', async () => {
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

  const alta = window.document.querySelector('.cards-grid.wide');
  const classicos = window.document.getElementById('classicos-cards');

  expect(alta).not.toBeNull();
  expect(alta.querySelectorAll('.card').length).toBe(5);
  expect(classicos).not.toBeNull();
  expect(classicos.querySelectorAll('.card').length).toBe(3);
});
