// ============================================================
// LEXABYTE - app.js
// Conteudos, favoritos, busca, filtros e autenticacao de tela.
// ============================================================

const modal = new Modal('app-modal');

const altaCards = document.getElementById('alta-cards');
const classicosCards = document.getElementById('classicos-cards');
const favoritesCards = document.getElementById('favorites-cards');
const navAuth = document.getElementById('nav-auth');
const navFavorites = document.getElementById('nav-favorites');
const navAddContent = document.getElementById('nav-add-content');
const userAreaAdd = document.getElementById('user-area-add');
const pageLinks = document.querySelectorAll('[data-page-link]');
const pageSections = document.querySelectorAll('[data-page-section]');
const filmesCards = document.getElementById('filmes-cards');
const seriesCards = document.getElementById('series-cards');
const livrosCards = document.getElementById('livros-cards');
const loginGate = document.getElementById('login-gate');
const userInfo = document.getElementById('user-info');
const userNameEl = document.getElementById('user-name');
const userEmailEl = document.getElementById('user-email');
const userMateriaisEl = document.getElementById('user-materiais');
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
const modalTriggerButtons = document.querySelectorAll('[data-modal-open]');
const infoButton = document.querySelector('.featured .btn-info');
const DEMO_SEED_FLAG = 'lexabyte-demo-seeded';

const DEMO_CONTENTS = [
  { tipo: 'livro', titulo: 'Dom Casmurro', descricao: 'Bentinho, Capitu e a dúvida que atravessa gerações da literatura brasileira.', capa_url: '', ano: 1899 },
  { tipo: 'livro', titulo: 'Grande Sertão: Veredas', descricao: 'Riobaldo e o sertão de Guimarães Rosa em uma travessia de linguagem e destino.', capa_url: '', ano: 1956 },
  { tipo: 'livro', titulo: 'Capitães da Areia', descricao: 'Uma leitura sobre infância, abandono e resistência nas ruas de Salvador.', capa_url: '', ano: 1937 },
  { tipo: 'livro', titulo: 'Memórias Póstumas de Brás Cubas', descricao: 'O narrador defunto abre espaço para ironia, crítica social e invenção literária.', capa_url: '', ano: 1881 },
  { tipo: 'livro', titulo: 'O Cortiço', descricao: 'Um retrato de desigualdade, convivência e tensões sociais no Rio de Janeiro.', capa_url: '', ano: 1890 },
  { tipo: 'filme', titulo: 'O Pagador de Promessas', descricao: 'Fé, justiça e conflito social em um dos marcos do cinema brasileiro.', capa_url: '', ano: 1962 },
  { tipo: 'filme', titulo: 'Vidas Secas', descricao: 'A seca, a fuga e a sobrevivência em uma adaptação essencial de Graciliano Ramos.', capa_url: '', ano: 1963 },
  { tipo: 'filme', titulo: 'Macunaíma', descricao: 'Um anti-herói brasileiro em uma adaptação vibrante e inventiva.', capa_url: '', ano: 1969 },
  { tipo: 'filme', titulo: 'Terra em Transe', descricao: 'Política, crise e tensão em um clássico do Cinema Novo.', capa_url: '', ano: 1967 },
  { tipo: 'filme', titulo: 'Limite', descricao: 'Obra silenciosa e experimental que segue influenciando o cinema nacional.', capa_url: '', ano: 1931 },
  { tipo: 'serie', titulo: 'O Bem-Amado', descricao: 'Satírica e política, a série virou referência de humor e crítica social.', capa_url: '', ano: 1973 },
  { tipo: 'serie', titulo: 'Sítio do Picapau Amarelo', descricao: 'A fantasia de Monteiro Lobato em uma adaptação marcante da TV brasileira.', capa_url: '', ano: 1977 },
  { tipo: 'serie', titulo: 'Carga Pesada', descricao: 'Estrada, amizade e trabalho em uma série querida pelo público.', capa_url: '', ano: 1979 },
  { tipo: 'serie', titulo: 'Malu Mulher', descricao: 'Independência, conflitos urbanos e emancipação feminina em uma série pioneira.', capa_url: '', ano: 1979 },
  { tipo: 'serie', titulo: 'Armação Ilimitada', descricao: 'Juventude, humor e cultura pop em um retrato emblemático dos anos 80.', capa_url: '', ano: 1985 },
];

const state = {
  conteudos: [],
  favoritos: new Map(),
};

function getAuthState() {
  const token = getAuthToken();
  const user = getStoredUser();
  return { token, user, isAuthenticated: Boolean(token && user) };
}

function requireLogin() {
  if (getAuthState().isAuthenticated) return true;
  window.location.href = 'login.html';
  return false;
}

function isAdminUser() {
  const { user } = getAuthState();
  return Boolean(user && user.is_admin);
}

function updateAuthUI() {
  const { user, isAuthenticated } = getAuthState();

  if (navAuth) navAuth.style.display = isAuthenticated ? '' : 'none';
  if (loginGate) loginGate.style.display = isAuthenticated ? 'none' : '';
  if (userInfo) userInfo.style.display = isAuthenticated ? 'flex' : 'none';
  if (favoritesCards) favoritesCards.style.display = isAuthenticated ? '' : 'none';

  if (isAuthenticated && user) {
    if (userNameEl) userNameEl.textContent = user.nome || user.username || 'Usuario';
    if (userEmailEl) userEmailEl.textContent = user.email || 'email@exemplo.com';
  }
}

function formatType(tipo) {
  return tipo ? String(tipo).toLowerCase() : 'outro';
}

function getPageNameFromHash() {
  const value = window.location.hash.replace('#', '').trim();
  if (['home', 'filmes', 'series', 'livros'].includes(value)) return value;
  return 'home';
}

function getConteudosByType(tipo) {
  return state.conteudos.filter(conteudo => formatType(conteudo.tipo) === tipo);
}

function renderCardList(container, conteudos, limit = 5) {
  if (!container) return;
  container.innerHTML = '';
  conteudos.slice(0, limit).forEach(conteudo => container.appendChild(createConteudoCard(conteudo)));
}

function syncPageVisibility(pageName) {
  pageSections.forEach(section => {
    section.hidden = section.dataset.pageSection !== pageName;
  });

  pageLinks.forEach(link => {
    if (link.closest('.nav-links')) {
      link.classList.toggle('active', link.dataset.pageLink === pageName);
    }
  });
}

function navigateToPage(pageName, { updateHash = true } = {}) {
  const targetPage = ['home', 'filmes', 'series', 'livros'].includes(pageName) ? pageName : 'home';
  syncPageVisibility(targetPage);

  if (updateHash && window.location.hash !== `#${targetPage}`) {
    window.history.replaceState(null, '', `#${targetPage}`);
  }

  const targetSection = document.querySelector(`[data-page-section="${targetPage}"]`);
  if (targetSection && typeof targetSection.scrollIntoView === 'function') {
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function asModalContent(conteudo) {
  return {
    ...conteudo,
    tipo: formatType(conteudo.tipo),
    autor_ou_criador: conteudo.ano ? String(conteudo.ano) : 'Ano nao informado',
    data_adicao: conteudo.criado_em,
  };
}

function favoriteFor(conteudoId) {
  return state.favoritos.get(Number(conteudoId));
}

function escapeAttr(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

function createConteudoCard(conteudo) {
  const card = document.createElement('div');
  const id = Number(conteudo.id_conteudo);
  const title = conteudo.titulo || 'Sem titulo';
  const type = formatType(conteudo.tipo);
  const favorite = favoriteFor(id);
  const cover = conteudo.capa_url
    ? `<img src="${escapeAttr(conteudo.capa_url)}" alt="${escapeAttr(title)}">`
    : `<div class="card-thumb-placeholder">${escapeAttr(title.split(' ').slice(0, 2).join(' ').toUpperCase())}</div>`;

  card.className = 'card';
  card.dataset.tipo = type;
  card.dataset.id = String(id);
  card.innerHTML = `
    <div class="card-thumb">
      ${cover}
      <span class="card-type-badge">${type}</span>
      <button type="button" class="card-favorite ${favorite ? 'active' : ''}" aria-label="${favorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}">${favorite ? '★' : '☆'}</button>
      <div class="card-overlay">
        <button type="button" class="card-play">Ver</button>
      </div>
    </div>
    <div class="card-info">
      <div class="card-title">${escapeAttr(title)}</div>
      <div class="card-meta">${conteudo.ano || 'Ano nao informado'}</div>
      ${isAdminUser() ? '<button type="button" class="card-admin-delete">Remover</button>' : ''}
    </div>
  `;

  const openDetails = () => modal.open(asModalContent(conteudo));
  card.querySelector('.card-thumb').addEventListener('click', (event) => {
    if (!event.target.closest('button')) openDetails();
  });
  card.querySelector('.card-play').addEventListener('click', (event) => {
    event.stopPropagation();
    openDetails();
  });
  card.querySelector('.card-favorite').addEventListener('click', async (event) => {
    event.stopPropagation();
    if (!requireLogin()) return;
    await toggleFavorito(id);
  });

  const deleteButton = card.querySelector('.card-admin-delete');
  if (deleteButton) {
    deleteButton.addEventListener('click', async (event) => {
      event.stopPropagation();
      await handleDeleteConteudo(id);
    });
  }

  return card;
}

function renderConteudos() {
  if (altaCards) {
    renderCardList(altaCards, state.conteudos, 5);
  }

  if (classicosCards) {
    renderCardList(classicosCards, getConteudosByType('livro'), 5);
  }

  renderCardList(filmesCards, getConteudosByType('filme'), 5);
  renderCardList(seriesCards, getConteudosByType('serie'), 5);
  renderCardList(livrosCards, getConteudosByType('livro'), 5);

  applyActiveFilter();
}

function renderFavoritos() {
  if (!favoritesCards) return;
  const { isAuthenticated } = getAuthState();
  const favoritos = Array.from(state.favoritos.values()).map(item => item.conteudo_detalhes).filter(Boolean);

  favoritesCards.style.display = isAuthenticated ? '' : 'none';
  favoritesCards.innerHTML = '';
  if (userMateriaisEl) userMateriaisEl.textContent = String(favoritos.length);

  if (!isAuthenticated) return;
  if (!favoritos.length) {
    favoritesCards.innerHTML = '<div class="empty-state">Nenhum favorito salvo ainda.</div>';
    return;
  }

  favoritos.forEach(conteudo => favoritesCards.appendChild(createConteudoCard(conteudo)));
}

async function loadConteudos() {
  const result = await getConteudos();
  if (!result.success || !Array.isArray(result.conteudos)) {
    console.warn('Erro ao buscar conteudos:', result.error);
    return;
  }
  state.conteudos = result.conteudos;
  renderConteudos();
}

async function seedDemoConteudos({ force = false } = {}) {
  if (!getAuthState().isAuthenticated) {
    return { success: false, error: 'Faça login para criar os conteúdos de teste.' };
  }

  if (!force && sessionStorage.getItem(DEMO_SEED_FLAG) === '1') {
    return { success: true, skipped: true, created: 0 };
  }

  const current = await getConteudos();
  if (!current.success || !Array.isArray(current.conteudos)) {
    return { success: false, error: current.error || 'Nao foi possivel carregar os conteudos existentes.' };
  }

  const existingTitles = new Set(current.conteudos.map(conteudo => conteudo.titulo));
  let created = 0;

  for (const conteudo of DEMO_CONTENTS) {
    if (existingTitles.has(conteudo.titulo)) continue;

    const result = await createConteudo(conteudo);
    if (!result.success) {
      return {
        success: false,
        error: `Falha ao criar "${conteudo.titulo}": ${result.error || 'erro desconhecido'}`,
      };
    }

    created += 1;
    existingTitles.add(conteudo.titulo);
  }

  sessionStorage.setItem(DEMO_SEED_FLAG, '1');
  await loadConteudos();
  return { success: true, created };
}

async function loadFavoritos() {
  state.favoritos.clear();
  if (!getAuthState().isAuthenticated) {
    renderFavoritos();
    return;
  }

  const result = await getFavoritos();
  if (!result.success) {
    console.warn('Erro ao buscar favoritos:', result.error);
    renderFavoritos();
    return;
  }

  result.favoritos.forEach(favorito => {
    state.favoritos.set(Number(favorito.conteudo), favorito);
  });
  renderFavoritos();
}

async function toggleFavorito(conteudoId) {
  const favorite = favoriteFor(conteudoId);
  const result = favorite ? await removeFavorito(favorite.id) : await addFavorito(conteudoId);
  if (!result.success) {
    console.warn('Erro ao atualizar favorito:', result.error);
    return;
  }

  await loadFavoritos();
  renderConteudos();
}

async function handleDeleteConteudo(conteudoId) {
  if (!isAdminUser()) return;
  if (!window.confirm('Remover este conteudo da biblioteca?')) return;

  const result = await deleteConteudo(conteudoId);
  if (!result.success) {
    window.alert('Nao foi possivel remover o conteudo.');
    return;
  }

  state.conteudos = state.conteudos.filter(conteudo => Number(conteudo.id_conteudo) !== Number(conteudoId));
  state.favoritos.delete(Number(conteudoId));
  renderConteudos();
  renderFavoritos();
}

function initContentModal() {
  const publishModal = document.createElement('div');
  publishModal.id = 'publish-modal';
  publishModal.className = 'publish-modal';
  publishModal.setAttribute('aria-hidden', 'true');
  publishModal.innerHTML = `
    <div class="modal-backdrop" role="presentation"></div>
    <div class="modal publish-modal-window" role="dialog" aria-modal="true" aria-labelledby="publish-modal-title">
      <button type="button" class="modal-close" aria-label="Fechar modal"><span aria-hidden="true">x</span></button>
      <div class="modal-content">
        <div class="section-tag">biblioteca</div>
        <h2 id="publish-modal-title" class="modal-title">Adicionar conteudo</h2>
        <form id="publish-form" class="publish-form">
          <div class="field-group">
            <label class="field">
              <span class="field-label">Titulo</span>
              <input class="field-input" id="publish-title" type="text" placeholder="Nome do conteudo" required>
            </label>
            <label class="field">
              <span class="field-label">Descricao</span>
              <textarea class="field-input" id="publish-description" rows="4" placeholder="Descricao do conteudo"></textarea>
            </label>
            <label class="field">
              <span class="field-label">Tipo</span>
              <select class="field-input" id="publish-type" required>
                <option value="">Selecione</option>
                <option value="livro">Livro</option>
                <option value="filme">Filme</option>
                <option value="serie">Serie</option>
              </select>
            </label>
            <label class="field">
              <span class="field-label">Ano</span>
              <input class="field-input" id="publish-year" type="number" min="0" max="3000" placeholder="2025">
            </label>
            <label class="field">
              <span class="field-label">URL da capa</span>
              <input class="field-input" id="publish-cover" type="url" placeholder="https://...">
            </label>
          </div>
          <div class="modal-actions">
            <button type="submit" class="btn-watch">Salvar conteudo</button>
            <button type="button" class="btn-secondary" id="seed-demo-btn">Gerar 5 conteúdos por página</button>
          </div>
          <p id="publish-status" class="form-status" aria-live="polite"></p>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(publishModal);

  const form = publishModal.querySelector('#publish-form');
  const status = publishModal.querySelector('#publish-status');
  const close = () => {
    publishModal.classList.remove('open');
    publishModal.setAttribute('aria-hidden', 'true');
  };
  const open = () => {
    if (!requireLogin()) return;
    publishModal.classList.add('open');
    publishModal.setAttribute('aria-hidden', 'false');
  };

  [navAddContent, userAreaAdd].forEach(button => {
    if (button) button.addEventListener('click', open);
  });
  publishModal.querySelector('.modal-close').addEventListener('click', close);
  publishModal.querySelector('.modal-backdrop').addEventListener('click', close);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!requireLogin()) return;

    const payload = {
      titulo: publishModal.querySelector('#publish-title').value.trim(),
      descricao: publishModal.querySelector('#publish-description').value.trim(),
      tipo: publishModal.querySelector('#publish-type').value,
      ano: publishModal.querySelector('#publish-year').value.trim(),
      capa_url: publishModal.querySelector('#publish-cover').value.trim(),
    };

    if (!payload.titulo || !payload.tipo) {
      status.textContent = 'Preencha titulo e tipo.';
      return;
    }

    status.textContent = 'Salvando conteudo...';
    const result = await createConteudo(payload);
    if (!result.success) {
      status.textContent = `Nao foi possivel salvar o conteudo: ${result.error || 'erro desconhecido'}`;
      return;
    }

    state.conteudos.unshift(result.conteudo);
    renderConteudos();
    form.reset();
    status.textContent = 'Conteudo adicionado.';
    setTimeout(close, 600);
  });

  const seedButton = publishModal.querySelector('#seed-demo-btn');
  if (seedButton) {
    seedButton.addEventListener('click', async () => {
      if (!requireLogin()) return;
      status.textContent = 'Criando conteúdos de teste...';
      const result = await seedDemoConteudos({ force: true });
      status.textContent = result.success
        ? `Conteúdos de teste criados: ${result.created}.`
        : `Nao foi possivel criar os testes: ${result.error || 'erro desconhecido'}`;
    });
  }
}

function openButtonModal(button) {
  if (!button) return;
  modal.open({
    titulo: button.dataset.modalTitle || 'Conteudo em destaque',
    tipo: button.dataset.modalType || 'texto',
    autor_ou_criador: button.dataset.modalSubtitle || 'LexaByte',
    descricao: button.dataset.modalText || '',
  });
}

function initFeatureButtons() {
  modalTriggerButtons.forEach(button => {
    button.addEventListener('click', () => openButtonModal(button));
  });

  if (infoButton) {
    infoButton.addEventListener('click', () => {
      if (altaCards) altaCards.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

function matchesFilter(cardType, filterName) {
  if (filterName === 'all') return true;
  return cardType === filterName;
}

function applyActiveFilter() {
  const active = document.querySelector('.filter-btn.active');
  const filter = active ? active.dataset.filter : 'all';
  const homePage = document.querySelector('[data-page-section="home"]');
  if (!homePage) return;

  homePage.querySelectorAll('.cards-grid .card, .cards-row .card').forEach(card => {
    const type = card.dataset.tipo ? card.dataset.tipo.toLowerCase() : '';
    card.style.display = matchesFilter(type, filter) ? '' : 'none';
  });
}

function runSearch() {
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const homePage = document.querySelector('[data-page-section="home"]');
  if (!homePage) return;

  homePage.querySelectorAll('.card').forEach(card => {
    if (!query) {
      card.style.display = '';
      return;
    }
    const title = card.querySelector('.card-title');
    const meta = card.querySelector('.card-meta');
    const text = `${title ? title.textContent : ''} ${meta ? meta.textContent : ''}`.toLowerCase();
    card.style.display = text.includes(query) ? '' : 'none';
  });
}

function initSearchAndFilters() {
  filterBtns.forEach(button => {
    button.addEventListener('click', () => {
      filterBtns.forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      applyActiveFilter();
    });
  });

  if (searchBtn) searchBtn.addEventListener('click', runSearch);
  if (searchInput) {
    searchInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') runSearch();
    });
    searchInput.addEventListener('input', () => {
      if (searchInput.value.trim() === '') applyActiveFilter();
    });
  }
}

function initNavActions() {
  if (navAuth) {
    navAuth.addEventListener('click', async () => {
      await logout();
      window.location.reload();
    });
  }

  if (navFavorites) {
    navFavorites.addEventListener('click', () => {
      document.getElementById('user-area').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  pageLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      const targetPage = link.dataset.pageLink;
      if (!targetPage) return;
      event.preventDefault();
      navigateToPage(targetPage);
    });
  });
}

function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  reveals.forEach(el => observer.observe(el));
}

function initPageNavigation() {
  navigateToPage(getPageNameFromHash(), { updateHash: false });

  window.addEventListener('hashchange', () => {
    navigateToPage(getPageNameFromHash(), { updateHash: false });
  });
}

updateAuthUI();
initReveal();
initFeatureButtons();
initSearchAndFilters();
initNavActions();
initContentModal();
initPageNavigation();
Promise.all([loadConteudos(), loadFavoritos()]).then(() => {
  renderConteudos();
  renderFavoritos();
});

window.loadConteudos = loadConteudos;
window.loadMaterials = loadConteudos;
window.renderConteudos = renderConteudos;
window.navigateConteudoPage = navigateToPage;
window.seedDemoConteudos = seedDemoConteudos;
