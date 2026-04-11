// ============================================================
// LEXABYTE — login.js
// Tabs de autenticação (login / cadastro) + API integration.
// ============================================================

const tabs   = document.querySelectorAll('.auth-tab');
const panels = document.querySelectorAll('.auth-panel');

// TAB SWITCHING
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    panels.forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    const target = document.getElementById(tab.dataset.target);
    if (target) target.classList.add('active');

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

// FORM HANDLING
const loginForm = document.querySelector('#panel-login form');
const registerForm = document.querySelector('#panel-cadastro form');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.querySelector('#login-email').value;
    const senha = document.querySelector('#login-senha').value;
    
    const result = await login(email, senha);
    if (result.success) {
      alert(`Bem-vindo, ${result.user.username}!`);
      window.location.href = 'app.html';
    } else {
      alert(`Erro: ${result.error}`);
    }
  });
}

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.querySelector('#cad-nome').value;
    const email = document.querySelector('#cad-email').value;
    const senha = document.querySelector('#cad-senha').value;
    
    const result = await register(nome, email, senha);
    if (result.success) {
      alert('Conta criada! Faça login agora.');
      document.querySelector('#tab-login').click();
      document.querySelector('#login-email').value = email;
    } else {
      alert(`Erro: ${result.error}`);
    }
  });
}