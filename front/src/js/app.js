// ============================================================
// LEXABYTE — app.js
// Filtros, busca e scroll reveal. Sem matrix rain, sem cursor.
// ============================================================

// ---- SCROLL REVEAL ----
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target); // dispara uma vez
      }
    });
  }, { threshold: 0.08 });
  reveals.forEach(el => observer.observe(el));
}

// ---- FILTROS ----
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    const cards = document.querySelectorAll('.cards-grid .card, .cards-row .card');

    cards.forEach(card => {
      const badge = card.querySelector('.card-type-badge');
      const type = badge ? badge.textContent.trim().toLowerCase() : '';
      if (filter === 'all' || type === filter) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ---- BUSCA ----
const searchInput = document.querySelector('.search-input');
const searchBtn   = document.querySelector('.search-btn');

function runSearch() {
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  if (!query) return;

  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const title = card.querySelector('.card-title');
    const meta  = card.querySelector('.card-meta');
    const text  = ((title ? title.textContent : '') + ' ' + (meta ? meta.textContent : '')).toLowerCase();
    card.style.display = text.includes(query) ? '' : 'none';
  });
}

if (searchBtn)  searchBtn.addEventListener('click', runSearch);
if (searchInput) {
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') runSearch();
    // limpar filtro ao apagar tudo
    if (e.key === 'Backspace' && searchInput.value.length <= 1) {
      document.querySelectorAll('.card').forEach(c => c.style.display = '');
    }
  });
}

const modalOverlay = document.getElementById('content-modal');
const modalTitle = document.getElementById('modal-title');
const modalSubtitle = document.querySelector('.modal-subtitle');
const modalBody = document.querySelector('.modal-body');
const modalClose = document.querySelector('.modal-close');

function openModal(event) {
  const button = event.currentTarget;
  const title = button.dataset.modalTitle || '';
  const subtitle = button.dataset.modalSubtitle || '';
  const type = button.dataset.modalType || 'text';
  const src = button.dataset.modalSrc || '';
  const text = button.dataset.modalText || '';

  modalTitle.textContent = title;
  modalSubtitle.textContent = subtitle;

  if (type === 'video' && src) {
    modalBody.innerHTML = `
      <div class="modal-video">
        <iframe src="${src}" title="${title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    `;
  } else {
    modalBody.innerHTML = `<p></p>`;
    modalBody.querySelector('p').textContent = text;
  }

  modalOverlay.classList.add('active');
  modalOverlay.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  modalOverlay.classList.remove('active');
  modalOverlay.setAttribute('aria-hidden', 'true');
  modalBody.innerHTML = '';
}

document.querySelectorAll('[data-modal-open]').forEach(button => {
  button.addEventListener('click', openModal);
});

if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}

if (modalOverlay) {
  modalOverlay.addEventListener('click', event => {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });
}

// ---- DINÂMICO: Verificação de login ----
async function checkLoginStatus() {
  const user = getStoredUser();
  const navAuth = document.getElementById('nav-auth');
  const loginGate = document.getElementById('login-gate');
  const userInfo = document.getElementById('user-info');

  if (user) {
    // Usuário logado
    navAuth.innerHTML = '<button id="logout-btn" class="nav-cta">Sair</button>';
    document.getElementById('logout-btn').addEventListener('click', async () => {
      await logout();
      location.reload();
    });

    loginGate.style.display = 'none';
    userInfo.style.display = 'block';
    document.getElementById('user-name').textContent = user.username;
    document.getElementById('user-email').textContent = user.email;

    // Carregar materiais do usuário
    const userMateriaisResult = await getUserMateriais();
    const count = userMateriaisResult.success ? userMateriaisResult.materiais.length : 0;
    document.getElementById('user-materiais').textContent = count;
  } else {
    // Não logado
    navAuth.innerHTML = '<a href="login.html">Entrar</a>';
    loginGate.style.display = 'block';
    userInfo.style.display = 'none';
  }
}

// ---- DINÂMICO: Carregar materiais ----
async function loadMateriais() {
  const result = await getMateriais();
  if (result.success) {
    const materiais = result.materiais;
    const altaContainer = document.getElementById('alta-cards');
    const classicosContainer = document.getElementById('classicos-cards');

    // Limpar containers
    altaContainer.innerHTML = '';
    classicosContainer.innerHTML = '';

    materiais.forEach(material => {
      const card = createCard(material);
      // Para simplificar, adicionar todos em alta, ou filtrar por alguma lógica
      // Assumir que materiais têm tipo: livro, filme, serie
      if (material.tipo === 'livro') {
        classicosContainer.appendChild(card);
      } else {
        altaContainer.appendChild(card);
      }
    });
  }
}

function createCard(material) {
  const card = document.createElement('div');
  card.className = 'card';

  const tipo = material.tipo; // slug: livro, filme, serie
  const badgeText = tipo === 'livro' ? 'livro' : tipo === 'filme' ? 'filme' : 'série';

  card.innerHTML = `
    <div class="card-thumb">
      <div class="card-thumb-placeholder">${material.titulo.toUpperCase().replace(' ', '<br>')}</div>
      <span class="card-type-badge">${badgeText}</span>
      <div class="card-overlay">
        <button class="card-play" data-modal-open data-modal-title="${material.titulo}" data-modal-subtitle="${material.descricao || 'Descrição'}" data-modal-type="text" data-modal-text="${material.descricao || 'Conteúdo não disponível'}">${tipo === 'livro' ? 'Ler' : 'Assistir'}</button>
      </div>
    </div>
    <div class="card-info">
      <div class="card-title">${material.titulo}</div>
      <div class="card-meta">${material.autor_ou_criador} · ${material.data_adicao ? new Date(material.data_adicao).getFullYear() : ''}</div>
    </div>
  `;

  return card;
}

// ---- DINÂMICO: Adaptar filtros e busca para dados dinâmicos ----
function updateFiltersAndSearch() {
  // Os filtros e busca já funcionam com .card, então deve funcionar com cards dinâmicos
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  checkLoginStatus();
  loadMateriais();
  updateFiltersAndSearch();
});