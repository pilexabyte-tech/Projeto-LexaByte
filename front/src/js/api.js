const API_BASE_URL = 'http://127.0.0.1:8000/api';

function getAuthToken() {
    return localStorage.getItem('authToken');
}

function getHeaders(includeAuth = true) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getAuthToken();
    if (includeAuth && token) {
        headers['Authorization'] = `Token ${token}`;
    }
    return headers;
}

async function login(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/login/`, {
            method: 'POST',
            headers: getHeaders(false),
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            return { success: true, user: data };
        }
        return { success: false, error: data.detail || data.username || data.password || JSON.stringify(data) };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function register(username, email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/register/`, {
            method: 'POST',
            headers: getHeaders(false),
            body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            return { success: true, user: data };
        }
        return { success: false, error: data.username || data.email || data.password || JSON.stringify(data) };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function logout() {
    try {
        const response = await fetch(`${API_BASE_URL}/logout/`, {
            method: 'POST',
            headers: getHeaders(true),
        });
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        return { success: response.ok };
    } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        return { success: false, error: error.message };
    }
}

async function getCurrentUser() {
    try {
        const response = await fetch(`${API_BASE_URL}/user/`, {
            method: 'GET',
            headers: getHeaders(true),
        });
        if (response.ok) {
            const data = await response.json();
            return { success: true, user: data };
        }
        return { success: false, authenticated: false };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

async function getMateriais() {
    try {
        const response = await fetch(`${API_BASE_URL}/materiais/`, {
            method: 'GET',
            headers: getHeaders(false),
        });
        const data = await response.json();
        return { success: response.ok, materiais: data, error: response.ok ? null : data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function createMaterial(titulo, descricao, tipo, autor_ou_criador, link_acesso = '') {
    try {
        const response = await fetch(`${API_BASE_URL}/materiais/`, {
            method: 'POST',
            headers: getHeaders(true),
            body: JSON.stringify({
                titulo,
                descricao,
                tipo,
                autor_ou_criador,
                link_acesso,
            }),
        });
        const data = await response.json();
        return { success: response.ok, material: data, error: response.ok ? null : data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function deleteMaterial(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/materiais/${id}/`, {
            method: 'DELETE',
            headers: getHeaders(true),
        });
        return { success: response.ok || response.status === 204 };
    } catch (error) {
        return { success: false, error: error.message };
    }
}