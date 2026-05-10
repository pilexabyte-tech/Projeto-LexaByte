// ============================================================
// LEXABYTE — examples.js
// Exemplos de uso do ImageComponent e Modal
// ============================================================

/**
 * EXEMPLO 1: Uso simples com ImageComponent
 * 
 * Cria uma imagem clicável que abre um modal ao ser clicada
 */
function exampleBasicImageComponent() {
  // Inicializar o Modal (fazer isso uma vez na página)
  const modal = new Modal('app-modal');

  // Criar um ImageComponent
  const image = new ImageComponent({
    src: 'images/book-cover.jpg',
    alt: 'Capa do livro',
    title: 'Clique para mais informações',
    mediaLink: 'https://example.com/books/1',
    modal: modal,
    className: 'book-cover'
  });

  // Montar em um elemento do DOM
  image.mount('.book-container');
}

/**
 * EXEMPLO 2: Criar múltiplos ImageComponents
 */
function exampleMultipleImages() {
  const modal = new Modal('app-modal');

  const books = [
    {
      title: 'Dom Casmurro',
      src: 'images/dom-casmurro.jpg',
      link: 'https://example.com/books/dom-casmurro'
    },
    {
      title: 'Grande Sertão: Veredas',
      src: 'images/grande-sertao.jpg',
      link: 'https://example.com/books/grande-sertao'
    },
    {
      title: 'Iracema',
      src: 'images/iracema.jpg',
      link: 'https://example.com/books/iracema'
    }
  ];

  books.forEach(book => {
    const image = new ImageComponent({
      src: book.src,
      alt: book.title,
      title: book.title,
      mediaLink: book.link,
      modal: modal,
      className: 'gallery-item'
    });

    image.mount('.gallery');
  });
}

/**
 * EXEMPLO 3: ImageComponent com callback customizado
 */
function exampleCustomCallback() {
  const modal = new Modal('app-modal');

  const image = new ImageComponent({
    src: 'images/featured.jpg',
    alt: 'Imagem em destaque',
    title: 'Clique para mais opções',
    mediaLink: 'https://example.com/featured',
    modal: modal,
    onClick: () => {
      // Callback customizado
      console.log('Imagem clicada!');
      // Aqui você pode adicionar lógica customizada
    }
  });

  image.mount('.featured-container');
}

/**
 * EXEMPLO 4: Atualizar ImageComponent dinamicamente
 */
function exampleUpdateImage() {
  const modal = new Modal('app-modal');

  const image = new ImageComponent({
    src: 'images/initial.jpg',
    alt: 'Imagem inicial',
    mediaLink: 'https://example.com/initial'
  });

  image.mount('.container');

  // Depois de um tempo, atualizar a imagem
  setTimeout(() => {
    image.update({
      src: 'images/updated.jpg',
      alt: 'Imagem atualizada',
      mediaLink: 'https://example.com/updated',
      modal: modal
    });
  }, 2000);
}

/**
 * EXEMPLO 5: Modal com busca manual
 */
function exampleManualModalOpen() {
  const modal = new Modal('app-modal');

  // Botão para abrir modal manualmente
  document.querySelector('.manual-search-btn').addEventListener('click', () => {
    const mediaLink = document.querySelector('.media-link-input').value;
    
    if (mediaLink) {
      modal.open(mediaLink);
    }
  });
}

/**
 * EXEMPLO 6: Usar ModalState para verificar estado
 */
function exampleModalState() {
  const modal = new Modal('app-modal');

  // Abrir modal
  modal.open('https://example.com/media');

  // Verificar estado
  console.log('Modal aberto?', ModalState.isOpen);      // true
  console.log('Está carregando?', ModalState.isLoading()); // pode ser true
  console.log('Dados atuais:', ModalState.currentData);  // pode ser 'LOADING'

  // Fechar modal
  modal.close();
  console.log('Modal aberto?', ModalState.isOpen);      // false
}

/**
 * EXEMPLO 7: Integração com grid de cards
 */
function exampleCardGrid() {
  const modal = new Modal('app-modal');

  // Simular dados de uma API
  const materials = [
    {
      id: 1,
      titulo: 'Livro 1',
      tipo: 'livro',
      link_acesso: 'https://example.com/1',
      thumbnail: 'images/book1.jpg'
    },
    {
      id: 2,
      titulo: 'Livro 2',
      tipo: 'livro',
      link_acesso: 'https://example.com/2',
      thumbnail: 'images/book2.jpg'
    }
  ];

  const gridContainer = document.querySelector('.cards-grid');

  materials.forEach(material => {
    // Criar card com ImageComponent
    const card = document.createElement('div');
    card.className = 'card';

    // Criar imagem dentro do card
    const imageComponent = new ImageComponent({
      src: material.thumbnail,
      alt: material.titulo,
      mediaLink: material.link_acesso,
      modal: modal,
      className: 'card-image'
    });

    // Renderizar imagem no card
    const thumbDiv = document.createElement('div');
    thumbDiv.className = 'card-thumb';
    thumbDiv.appendChild(imageComponent.render());

    card.appendChild(thumbDiv);
    gridContainer.appendChild(card);
  });
}

/**
 * EXEMPLO 8: Tratamento de erros
 */
function exampleErrorHandling() {
  const modal = new Modal('app-modal');

  // Tentar abrir modal com link inválido
  modal.open('https://example.com/nonexistent-material');

  // O Modal automaticamente:
  // 1. Mostra spinner
  // 2. Busca no backend
  // 3. Se não encontrar, exibe mensagem de erro
  // 4. Oferece botão "Tentar novamente"
}

/**
 * EXEMPLO 9: Fechar modal programaticamente
 */
function exampleProgrammaticClose() {
  const modal = new Modal('app-modal');

  // Abrir modal
  modal.open('https://example.com/media');

  // Fechar após 5 segundos
  setTimeout(() => {
    modal.close();
  }, 5000);
}

/**
 * EXEMPLO 10: Uso com formulário
 */
function exampleFormIntegration() {
  const modal = new Modal('app-modal');

  const form = document.querySelector('#media-search-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const mediaLink = form.querySelector('input[name="link"]').value;
    
    if (mediaLink) {
      modal.open(mediaLink);
      form.reset();
    }
  });
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

// Descomente o exemplo que deseja executar
// exampleBasicImageComponent();
// exampleMultipleImages();
// exampleCustomCallback();
// exampleUpdateImage();
// exampleManualModalOpen();
// exampleModalState();
// exampleCardGrid();
// exampleErrorHandling();
// exampleProgrammaticClose();
// exampleFormIntegration();
