const API_BASE_URL = window.LEXABYTE_API_BASE_URL || 'https://projeto-lexabyte-production.up.railway.app/api';

function getAuthToken() {
    return sessionStorage.getItem('authToken');
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
            sessionStorage.setItem('authToken', data.token);
            sessionStorage.setItem('user', JSON.stringify(data));
            return { success: true, user: data };
        }
        return { success: false, error: data.detail || data.username || data.password || JSON.stringify(data) };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function register(nome, email, password) {
    try {
        const username = email.includes('@') ? email.split('@')[0] : email;
        const response = await fetch(`${API_BASE_URL}/register/`, {
            method: 'POST',
            headers: getHeaders(false),
            body: JSON.stringify({ username, email, password, nome }),
        });
        const data = await response.json();
        if (response.ok) {
            sessionStorage.setItem('authToken', data.token);
            sessionStorage.setItem('user', JSON.stringify(data));
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
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('user');
        return { success: response.ok };
    } catch (error) {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('user');
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
    const user = sessionStorage.getItem('user');
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

async function getConteudos() {
    try {
        const response = await fetch(`${API_BASE_URL}/conteudos/`, {
            method: 'GET',
            headers: getHeaders(false),
        });
        const data = await response.json();
        return { success: response.ok, conteudos: data, error: response.ok ? null : data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function createConteudo({ titulo, descricao, tipo, capa_url = '', ano = '' }) {
    try {
        const body = {
            titulo,
            descricao,
            tipo,
            capa_url,
            ano: ano ? Number(ano) : null,
        };

        const response = await fetch(`${API_BASE_URL}/conteudos/`, {
            method: 'POST',
            headers: getHeaders(true),
            body: JSON.stringify(body),
        });
        const data = await response.json();
        return { success: response.ok, conteudo: response.ok ? data : null, error: response.ok ? null : data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function deleteConteudo(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/conteudos/${id}/`, {
            method: 'DELETE',
            headers: getHeaders(true),
        });
        return { success: response.ok || response.status === 204 };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getFavoritos() {
    try {
        const response = await fetch(`${API_BASE_URL}/usuario-conteudo/`, {
            method: 'GET',
            headers: getHeaders(true),
        });
        const data = await response.json();
        return { success: response.ok, favoritos: response.ok ? data : [], error: response.ok ? null : data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function addFavorito(conteudoId) {
    try {
        const response = await fetch(`${API_BASE_URL}/usuario-conteudo/`, {
            method: 'POST',
            headers: getHeaders(true),
            body: JSON.stringify({ conteudo: conteudoId }),
        });
        const data = await response.json();
        return { success: response.ok, favorito: response.ok ? data : null, error: response.ok ? null : data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function removeFavorito(favoritoId) {
    try {
        const response = await fetch(`${API_BASE_URL}/usuario-conteudo/${favoritoId}/`, {
            method: 'DELETE',
            headers: getHeaders(true),
        });
        return { success: response.ok || response.status === 204 };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getUserMateriais() {
    try {
        const response = await fetch(`${API_BASE_URL}/materiais/`, {
            method: 'GET',
            headers: getHeaders(true),
        });
        const data = await response.json();
        if (response.ok) {
            const user = getStoredUser();
            const userMateriais = data.filter(m => m.owner === user.username);
            return { success: true, materiais: userMateriais };
        }
        return { success: false, error: data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function createMaterial(titulo, descricao, tipo, autor_ou_criador, link_acesso = '', ano = '', genero = '') {
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
        return {
            success: response.ok,
            material: response.ok ? { ...data, ano, genero } : data,
            error: response.ok ? null : data,
        };
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

if (typeof window !== 'undefined') {
    window.getAuthToken = getAuthToken;
    window.getStoredUser = getStoredUser;
    window.getHeaders = getHeaders;
}
