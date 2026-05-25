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
    const status = getOrCreateStatus(loginForm);
    if (result.success) {
      // sucesso: redireciona sem alert
      window.location.href = 'app.html';
    } else {
      showStatusError(status, `Erro: ${result.error}`);
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
    const status = getOrCreateStatus(registerForm);
    if (result.success) {
      showStatusSuccess(status, 'Conta criada! Faça login agora.');
      // troca para a tab de login e preenche o e-mail
      const tabLogin = document.querySelector('#tab-login');
      if (tabLogin) tabLogin.click();
      const loginEmail = document.querySelector('#login-email');
      if (loginEmail) loginEmail.value = email;
    } else {
      showStatusError(status, `Erro: ${result.error}`);
    }
  });
}

// ---- Helpers: status inline ----
function getOrCreateStatus(form) {
  if (!form) return null;
  let status = form.querySelector('.form-status');
  if (!status) {
    status = document.createElement('p');
    status.className = 'form-status';
    status.setAttribute('aria-live', 'polite');
    // Insere antes do botão submit
    const submit = form.querySelector('button[type="submit"]');
    if (submit && submit.parentNode) {
      submit.parentNode.insertBefore(status, submit);
    } else {
      form.appendChild(status);
    }
  }
  // limpa classes
  status.classList.remove('error', 'success');
  status.style.color = '';
  status.textContent = '';
  return status;
}

function showStatusError(statusEl, message) {
  if (!statusEl) return;
  statusEl.classList.add('error');
  statusEl.style.color = '#ff4444';
  statusEl.textContent = message;
}

function showStatusSuccess(statusEl, message) {
  if (!statusEl) return;
  statusEl.classList.add('success');
  statusEl.style.color = '#2ea44f';
  statusEl.textContent = message;
}