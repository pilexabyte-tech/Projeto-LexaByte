// ============================================================
// LEXABYTE — app.js
// Filtros, busca, scroll reveal e integração com componentes
// ============================================================

// Inicializa o Modal globalmente
const modal = new Modal('app-modal');

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

    // Mapeamento entre tipos retornados pela API e filtros da UI
    // API types normalized via formatType(): e.g. 'livro', 'video', 'artigo', 'curso', 'serie', 'outro'
    function matchesFilter(cardType, filterName) {
      if (filterName === 'all') return true;
      if (!cardType) return false;
      if (filterName === 'livro') return cardType === 'livro';
      if (filterName === 'filme') return cardType === 'video';
      if (filterName === 'serie') return cardType === 'serie';
      // filtros desconhecidos: não mostrar
      return false;
    }

    cards.forEach(card => {
      const type = (card.dataset && card.dataset.tipo) ? card.dataset.tipo.toLowerCase() : '';
      if (matchesFilter(type, filter)) {
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

if (searchBtn) searchBtn.addEventListener('click', runSearch);
if (searchInput) {
  // Enter executa busca
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') runSearch();
  });

  // Resetar filtro quando o campo fica vazio por qualquer ação (input covers paste, delete, clear, mouse)
  searchInput.addEventListener('input', () => {
    if (searchInput.value.trim() === '') {
      document.querySelectorAll('.card').forEach(c => c.style.display = '');
    }
  });
}

// Backend integration: fetch materiais from Django API
const API_URL = 'http://127.0.0.1:8000/api/materiais/';
const cardsGrid = document.querySelector('.cards-grid.wide');
const classicosCards = document.getElementById('classicos-cards');

function formatType(tipo) {
  return tipo ? tipo.toLowerCase() : 'outro';
}

function createMaterialCard(material) {
  const card = document.createElement('div');
  card.className = 'card';
  // adiciona atributo data-tipo padronizado em lowercase para filtros
  card.dataset.tipo = formatType(material.tipo);
  const title = material.titulo || 'Sem título';
  const badge = formatType(material.tipo);
  const meta = material.autor_ou_criador || 'Sem autor';
  const actionLabel = material.link_acesso ? 'Acessar' : 'Ver';

  card.innerHTML = `
    <div class="card-thumb">
      <div class="card-thumb-placeholder">${title.split(' ').slice(0, 2).join(' ').toUpperCase()}</div>
      <span class="card-type-badge">${badge}</span>
      <div class="card-overlay">
        <button class="card-play">${actionLabel}</button>
      </div>
    </div>
    <div class="card-info">
      <div class="card-title">${title}</div>
      <div class="card-meta">${meta}</div>
    </div>
  `;
  
  // Adiciona listener para abrir o modal ao clicar no card
  if (material.link_acesso) {
    const cardThumb = card.querySelector('.card-thumb');
    cardThumb.style.cursor = 'pointer';
    
    cardThumb.addEventListener('click', (e) => {
      e.preventDefault();
      // Passa o link de acesso para o modal buscar os dados
      modal.open(material.link_acesso);
    });
  }

  return card;
}

async function loadMaterials() {
  if (!cardsGrid) return;

  // Limpa ambos os contêineres se existirem
  if (classicosCards) classicosCards.innerHTML = '';

  try {
    const res = await fetch(API_URL);
    if (!res.ok) return;
    const data = await res.json();
    if (!Array.isArray(data) || !data.length) return;

    cardsGrid.innerHTML = '';
    // Primeiros 5 vão para o destaque
    data.slice(0, 5).forEach(material => cardsGrid.appendChild(createMaterialCard(material)));

    // Próximos 3 (índices 5..7) vão para a seção clássicos
    if (classicosCards) {
      data.slice(5, 8).forEach(material => classicosCards.appendChild(createMaterialCard(material)));
    }
  } catch (error) {
    console.warn('Erro ao buscar materiais:', error);
  }
}

loadMaterials();

// ---- BANNER FEATURED: abrir modal a partir do botão 'Acessar' ----
const featuredBtn = document.querySelector('.featured .btn-watch[data-modal-open]');
if (featuredBtn) {
  featuredBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const btn = e.currentTarget;

    const material = {
      titulo: btn.dataset.modalTitle || '',
      tipo: btn.dataset.modalType || 'texto',
      descricao: btn.dataset.modalText || '',
      autor_ou_criador: btn.dataset.modalSubtitle || '',
      link_acesso: ''
    };

    // Usa o estado do Modal e os métodos públicos para renderizar o conteúdo
    if (window.ModalState && typeof window.ModalState.open === 'function') {
      ModalState.open(material);
    }

    if (modal && typeof modal.showContent === 'function') {
      modal.showContent(material);
      if (modal.container) modal.container.classList.add('open');
    }
  });
}

// Botão 'Mais detalhes' no banner: rolar até a seção 'Em alta'
const infoBtn = document.querySelector('.featured .btn-info');
if (infoBtn) {
  infoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById('alta-cards');
    if (target && typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

// ---- AUTH UI ----
function updateAuthUI() {
  const user = (typeof getStoredUser === 'function') ? getStoredUser() : null;
  const token = (typeof getAuthToken === 'function') ? getAuthToken() : null;

  const navAuth = document.getElementById('nav-auth');
  const loginGate = document.getElementById('login-gate');
  const userInfo = document.getElementById('user-info');
  const userNameEl = document.getElementById('user-name');
  const userEmailEl = document.getElementById('user-email');

  if (user && token) {
    if (navAuth) {
      navAuth.textContent = 'Sair';
      navAuth.removeAttribute('href');
      navAuth.style.cursor = 'pointer';
      navAuth.onclick = async (e) => {
        e.preventDefault();
        if (typeof logout === 'function') {
          await logout();
        } else {
          sessionStorage.removeItem('authToken');
          sessionStorage.removeItem('user');
        }
        window.location.href = 'login.html';
      };
    }

    if (loginGate) loginGate.style.display = 'none';
    if (userInfo) userInfo.style.display = 'flex';
    if (userNameEl) userNameEl.textContent = user.username || '';
    if (userEmailEl) userEmailEl.textContent = user.email || '';
  } else {
    if (navAuth) {
      navAuth.textContent = 'Entrar';
      navAuth.setAttribute('href', 'login.html');
      navAuth.style.cursor = '';
      navAuth.onclick = null;
    }
    if (loginGate) loginGate.style.display = '';
    if (userInfo) userInfo.style.display = 'none';
  }
}

// Chama imediatamente ou quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateAuthUI);
} else {
  updateAuthUI();
}