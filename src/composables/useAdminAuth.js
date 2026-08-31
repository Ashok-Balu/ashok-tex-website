import { ref } from 'vue';
import { adminApi } from '../services/api';

const TOKEN_KEY = 'ashoktex_admin_token';
const USER_KEY = 'ashoktex_admin_user';

function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function hasValidToken() {
  const currentToken = localStorage.getItem(TOKEN_KEY);
  if (!currentToken) return false;
  const payload = decodeJwtPayload(currentToken);
  if (!payload || typeof payload.exp !== 'number') return false;
  return Date.now() < payload.exp * 1000;
}

const token = ref(hasValidToken() ? localStorage.getItem(TOKEN_KEY) : null);
const user = ref(JSON.parse(localStorage.getItem(USER_KEY) || 'null'));

export function useAdminAuth() {
  async function login(username, password) {
    const res = await adminApi.login(username, password);
    token.value = res.token;
    user.value = res.user;
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  function isAuthenticated() {
    if (!hasValidToken()) {
      token.value = null;
      user.value = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return false;
    }
    return !!token.value;
  }

  return { token, user, login, logout, isAuthenticated };
}
