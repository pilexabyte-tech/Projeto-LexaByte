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
    altaCards.innerHTML = '';
    state.conteudos.slice(0, 8).forEach(conteudo => altaCards.appendChild(createConteudoCard(conteudo)));
  }

  if (classicosCards) {
    classicosCards.innerHTML = '';
    state.conteudos
      .filter(conteudo => formatType(conteudo.tipo) === 'livro')
      .slice(0, 8)
      .forEach(conteudo => classicosCards.appendChild(createConteudoCard(conteudo)));
  }

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
          <button type="submit" class="btn-watch">Salvar conteudo</button>
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
      status.textContent = 'Nao foi possivel salvar o conteudo.';
      return;
    }

    state.conteudos.unshift(result.conteudo);
    renderConteudos();
    form.reset();
    status.textContent = 'Conteudo adicionado.';
    setTimeout(close, 600);
  });
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
  document.querySelectorAll('.cards-grid .card, .cards-row .card').forEach(card => {
    const type = card.dataset.tipo ? card.dataset.tipo.toLowerCase() : '';
    card.style.display = matchesFilter(type, filter) ? '' : 'none';
  });
}

function runSearch() {
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  document.querySelectorAll('.card').forEach(card => {
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

updateAuthUI();
initReveal();
initFeatureButtons();
initSearchAndFilters();
initNavActions();
initContentModal();
Promise.all([loadConteudos(), loadFavoritos()]).then(() => {
  renderConteudos();
  renderFavoritos();
});
