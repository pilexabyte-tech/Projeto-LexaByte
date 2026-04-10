// ============================================================
// LEXABYTE — login.js
// Tabs de autenticação (login / cadastro).
// ============================================================

const tabs   = document.querySelectorAll('.auth-tab');
const panels = document.querySelectorAll('.auth-panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // remove active de tudo
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    panels.forEach(p => p.classList.remove('active'));

    // ativa o clicado
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    const target = document.getElementById(tab.dataset.target);
    if (target) target.classList.add('active');

    // ajusta o título
    const title = document.querySelector('.login-form-title');
    if (title) {
      if (tab.dataset.target === 'panel-login') {
        title.innerHTML = 'Bem-vindo de <em>volta</em>';
      } else {
        title.innerHTML = 'Criar sua <em>conta</em>';
      }
    }
  });
});