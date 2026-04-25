// ============================================================
// LEXABYTE — components.js
// Componentes reutilizáveis: ImageComponent, Modal
// ============================================================

// ---- MODAL STATE ----
// Gerencia o estado global do modal
const ModalState = {
  isOpen: false,
  currentData: null,
  
  open(data) {
    this.currentData = data;
    this.isOpen = true;
  },
  
  close() {
    this.currentData = null;
    this.isOpen = false;
  },
  
  isLoading() {
    return this.currentData === 'LOADING';
  },
  
  setLoading() {
    this.currentData = 'LOADING';
    this.isOpen = true;
  }
};

// ============================================================
// MODAL COMPONENT
// ============================================================
class Modal {
  constructor(containerId = 'app-modal') {
    this.containerId = containerId;
    this.container = null;
    this.modal = null;
    this.backdrop = null;
    this.init();
  }
  
  init() {
    // Verifica se já existe um modal no DOM
    this.container = document.getElementById(this.containerId);
    
    if (!this.container) {
      // Cria o container se não existir
      this.container = document.createElement('div');
      this.container.id = this.containerId;
      document.body.appendChild(this.container);
    }
    
    // Renderiza o modal
    this.render();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="modal-backdrop" role="presentation"></div>
      <div class="modal" role="dialog" aria-labelledby="modal-title">
        <button class="modal-close" aria-label="Fechar modal">
          <span aria-hidden="true">✕</span>
        </button>
        <div class="modal-content">
          <h2 id="modal-title" class="modal-title">Detalhes do Material</h2>
          <div class="modal-body"></div>
        </div>
      </div>
    `;
    
    this.modal = this.container.querySelector('.modal');
    this.backdrop = this.container.querySelector('.modal-backdrop');
    this.closeBtn = this.container.querySelector('.modal-close');
    this.modalBody = this.container.querySelector('.modal-body');
    
    // Event listeners
    this.closeBtn.addEventListener('click', () => this.close());
    this.backdrop.addEventListener('click', () => this.close());
    
    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && ModalState.isOpen) {
        this.close();
      }
    });
  }
  
  async open(mediaLink) {
    ModalState.setLoading();
    this.showLoading();
    
    try {
      // Buscar dados do backend usando o link de mídia
      const response = await fetch(
        `http://127.0.0.1:8000/api/materiais/buscar/por-link/?link_acesso=${encodeURIComponent(mediaLink)}`
      );
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Se for um array, pega o primeiro item
      const material = Array.isArray(data) ? data[0] : data;
      
      ModalState.open(material);
      this.showContent(material);
      this.container.classList.add('open');
      
    } catch (error) {
      console.error('Erro ao buscar material:', error);
      ModalState.open(null);
      this.showError(`Erro ao carregar material: ${error.message}`);
      this.container.classList.add('open');
    }
  }
  
  showLoading() {
    this.modalBody.innerHTML = `
      <div class="modal-loading" role="status" aria-live="polite">
        <div class="spinner"></div>
        <p>Carregando...</p>
      </div>
    `;
  }
  
  showError(message) {
    this.modalBody.innerHTML = `
      <div class="modal-error" role="alert">
        <p>${message}</p>
        <button class="btn-retry">Tentar novamente</button>
      </div>
    `;
  }
  
  showContent(material) {
    if (!material) {
      this.showError('Material não encontrado');
      return;
    }
    
    const formattedDate = material.data_adicao 
      ? new Date(material.data_adicao).toLocaleDateString('pt-BR')
      : 'Data não disponível';
    
    this.modalBody.innerHTML = `
      <div class="modal-material">
        <div class="material-header">
          <h3 class="material-title">${this.escapeHtml(material.titulo)}</h3>
          <span class="material-type">${this.escapeHtml(material.tipo)}</span>
        </div>
        
        <div class="material-details">
          <div class="detail-row">
            <span class="detail-label">Autor/Criador:</span>
            <span class="detail-value">${this.escapeHtml(material.autor_ou_criador)}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Descrição:</span>
            <span class="detail-value">${this.escapeHtml(material.descricao)}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Data de Adição:</span>
            <span class="detail-value">${formattedDate}</span>
          </div>
          
          ${material.link_acesso ? `
            <div class="detail-row">
              <span class="detail-label">Link:</span>
              <a href="${this.escapeHtml(material.link_acesso)}" target="_blank" class="detail-link">
                Acessar material
              </a>
            </div>
          ` : ''}
        </div>
        
        <div class="modal-actions">
          ${material.link_acesso ? `
            <button class="btn-primary btn-iframe-open">
              Acessar Material
            </button>
          ` : ''}
          <button class="btn-secondary" onclick="document.getElementById('${this.containerId}').classList.remove('open')">
            Fechar
          </button>
        </div>
      </div>
    `;
    
    // Adiciona listener para abrir iframe
    if (material.link_acesso) {
      const iframeBtn = this.modalBody.querySelector('.btn-iframe-open');
      if (iframeBtn) {
        iframeBtn.addEventListener('click', () => {
          this.openInIframe(material.link_acesso);
        });
      }
    }
  }
  
  close() {
    this.container.classList.remove('open');
    ModalState.close();
  }
  
  openInIframe(url) {
    if (!url) return;
    
    this.container.classList.add('open');
    ModalState.setLoading();
    this.showLoading();
    
    setTimeout(() => {
      this.modalBody.innerHTML = `
        <div class="modal-iframe-container">
          <iframe src="${this.escapeHtml(url)}" frameborder="0" allow="fullscreen"></iframe>
        </div>
      `;
      ModalState.open({ link_acesso: url });
    }, 500);
  }
  
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// ============================================================
// IMAGE COMPONENT
// ============================================================
class ImageComponent {
  constructor(config = {}) {
    this.id = config.id || `img-${Math.random().toString(36).substr(2, 9)}`;
    this.src = config.src || '';
    this.alt = config.alt || 'Imagem';
    this.title = config.title || '';
    this.mediaLink = config.mediaLink || '';
    this.onClick = config.onClick || null;
    this.modal = config.modal || null;
    this.className = config.className || '';
    this.element = null;
  }
  
  render() {
    this.element = document.createElement('div');
    this.element.className = `image-component ${this.className}`.trim();
    this.element.id = this.id;
    
    // Se houver link de mídia e modal, torna a imagem clicável
    const isClickable = this.mediaLink && this.modal;
    
    this.element.innerHTML = `
      <img 
        src="${this.escapeHtml(this.src)}" 
        alt="${this.escapeHtml(this.alt)}"
        title="${this.escapeHtml(this.title)}"
        class="image-component-img ${isClickable ? 'clickable' : ''}"
        ${isClickable ? 'role="button" tabindex="0"' : ''}
      />
    `;
    
    if (isClickable) {
      const img = this.element.querySelector('img');
      
      // Click com mouse
      img.addEventListener('click', () => this.handleClick());
      
      // Enter/Space com teclado
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleClick();
        }
      });
    }
    
    return this.element;
  }
  
  handleClick() {
    if (this.onClick) {
      this.onClick();
    } else if (this.modal && this.mediaLink) {
      this.modal.open(this.mediaLink);
    }
  }
  
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // Método para atualizar propriedades
  update(config) {
    Object.assign(this, config);
    if (this.element && this.element.parentNode) {
      const parent = this.element.parentNode;
      parent.replaceChild(this.render(), this.element);
    }
  }
  
  // Método para montar em um elemento pai
  mount(parentSelector) {
    const parent = document.querySelector(parentSelector);
    if (parent) {
      parent.appendChild(this.render());
    }
    return this.element;
  }
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================
// Exporta as classes globalmente
window.Modal = Modal;
window.ImageComponent = ImageComponent;
window.ModalState = ModalState;
