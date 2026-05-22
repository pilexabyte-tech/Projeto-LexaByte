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

// Backend integration: fetch materiais from Django API
const API_URL = `${API_BASE_URL}/materiais/`;
const cardsGrid = document.querySelector('.cards-grid.wide');

function getUserRole() {
  const user = typeof getStoredUser === 'function' ? getStoredUser() : null;
  return String((user && (user.role || user.papel || user.tipo || user.perfil)) || '').toLowerCase();
}

function canPublishContent() {
  return Boolean(
    typeof getAuthToken === 'function' &&
    getAuthToken() &&
    ['autor', 'admin'].includes(getUserRole())
  );
}

function formatType(tipo) {
  return tipo ? tipo.toLowerCase() : 'outro';
}

function createMaterialCard(material) {
  const card = document.createElement('div');
  card.className = 'card';
  const title = material.titulo || 'Sem título';
  const badge = formatType(material.tipo);
  const meta = material.genero ? `${material.autor_ou_criador} · ${material.genero}` : material.autor_ou_criador || 'Sem autor';
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
  
  const cardThumb = card.querySelector('.card-thumb');
  if (cardThumb) {
    cardThumb.style.cursor = 'pointer';
    cardThumb.addEventListener('click', (e) => {
      e.preventDefault();
      modal.open(material);
    });
  }

  return card;
}

function initPublishModal() {
  if (!canPublishContent()) return;

  const contentArea = document.querySelector('.content-area');
  if (!contentArea) return;

  const publishSection = document.createElement('section');
  publishSection.className = 'content-section reveal visible publish-entry';
  publishSection.innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-tag">publicar</div>
        <h2 class="section-heading">Cadastrar novo <em>conteúdo</em></h2>
      </div>
      <button type="button" class="btn-watch" id="publish-open">Publicar conteúdo</button>
    </div>
  `;
  contentArea.appendChild(publishSection);

  const publishModal = document.createElement('div');
  publishModal.id = 'publish-modal';
  publishModal.className = 'publish-modal';
  publishModal.setAttribute('aria-hidden', 'true');
  publishModal.innerHTML = `
    <div class="modal-backdrop" role="presentation"></div>
    <div class="modal publish-modal-window" role="dialog" aria-modal="true" aria-labelledby="publish-modal-title">
      <button type="button" class="modal-close" aria-label="Fechar modal"><span aria-hidden="true">×</span></button>
      <div class="modal-content">
        <div class="section-tag">publicar</div>
        <h2 id="publish-modal-title" class="modal-title">Novo conteúdo</h2>
        <form id="publish-form" class="publish-form">
          <div class="field-group">
            <label class="field">
              <span class="field-label">Nome</span>
              <input class="field-input" id="publish-title" type="text" placeholder="Nome do conteúdo" required>
            </label>
            <label class="field">
              <span class="field-label">Descrição</span>
              <textarea class="field-input" id="publish-description" rows="4" placeholder="Descrição do conteúdo" required></textarea>
            </label>
            <label class="field">
              <span class="field-label">Criador</span>
              <input class="field-input" id="publish-creator" type="text" placeholder="Autor ou criador" required>
            </label>
            <label class="field">
              <span class="field-label">Ano de lançamento</span>
              <input class="field-input" id="publish-year" type="number" min="0" placeholder="2025">
            </label>
            <label class="field">
              <span class="field-label">Tipo de conteúdo</span>
              <select class="field-input" id="publish-type" required>
                <option value="">Selecione</option>
                <option value="LIVRO">Livro</option>
                <option value="VIDEO">Vídeo</option>
                <option value="ARTIGO">Artigo</option>
                <option value="CURSO">Curso</option>
                <option value="OUTRO">Outro</option>
              </select>
            </label>
            <label class="field">
              <span class="field-label">Gênero</span>
              <input class="field-input" id="publish-genre" type="text" placeholder="Gênero do conteúdo">
            </label>
          </div>
          <button type="submit" class="btn-watch">Publicar conteúdo</button>
          <p id="publish-status" class="form-status" aria-live="polite"></p>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(publishModal);

  const publishForm = document.querySelector('#publish-form');
  const publishStatus = document.querySelector('#publish-status');
  const closePublishModal = () => {
    publishModal.classList.remove('open');
    publishModal.setAttribute('aria-hidden', 'true');
  };

  document.querySelector('#publish-open').addEventListener('click', () => {
    publishModal.classList.add('open');
    publishModal.setAttribute('aria-hidden', 'false');
  });
  publishModal.querySelector('.modal-close').addEventListener('click', closePublishModal);
  publishModal.querySelector('.modal-backdrop').addEventListener('click', closePublishModal);

  publishForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const titulo = document.querySelector('#publish-title').value.trim();
    const descricao = document.querySelector('#publish-description').value.trim();
    const criador = document.querySelector('#publish-creator').value.trim();
    const tipo = document.querySelector('#publish-type').value;
    const ano = document.querySelector('#publish-year').value.trim();
    const genero = document.querySelector('#publish-genre').value.trim();

    if (!titulo || !descricao || !criador || !tipo) {
      if (publishStatus) publishStatus.textContent = 'Preencha nome, descrição, criador e tipo.';
      return;
    }

    if (publishStatus) publishStatus.textContent = 'Enviando conteúdo...';

    const result = await createMaterial(titulo, descricao, tipo, criador, '', ano, genero);

    if (result.success) {
      if (publishStatus) publishStatus.textContent = 'Conteúdo publicado com sucesso!';
      if (cardsGrid) cardsGrid.appendChild(createMaterialCard(result.material));
      publishForm.reset();
      setTimeout(closePublishModal, 700);
    } else {
      if (publishStatus) publishStatus.textContent = `Erro ao publicar: ${result.error || 'não foi possível salvar.'}`;
    }
  });
}

async function loadMaterials() {
  if (!cardsGrid) return;

  try {
    const res = await fetch(API_URL);
    if (!res.ok) return;
    const data = await res.json();
    if (!Array.isArray(data) || !data.length) return;

    cardsGrid.innerHTML = '';
    data.slice(0, 5).forEach(material => cardsGrid.appendChild(createMaterialCard(material)));
  } catch (error) {
    console.warn('Erro ao buscar materiais:', error);
  }
}

loadMaterials();
initPublishModal();
