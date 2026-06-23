/**
 * Auth Utility — Login state management
 */

const Auth = {
  getToken() {
    return localStorage.getItem('vol_token');
  },

  getUser() {
    try {
      const user = localStorage.getItem('vol_user');
      return user ? JSON.parse(user) : null;
    } catch { return null; }
  },

  setAuth(token, user) {
    localStorage.setItem('vol_token', token);
    localStorage.setItem('vol_user', JSON.stringify(user));
  },

  clearAuth() {
    localStorage.removeItem('vol_token');
    localStorage.removeItem('vol_user');
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (e) { /* ignore */ }
    this.clearAuth();
    window.location.href = '/login';
  },

  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = '/login';
      return false;
    }
    return true;
  },

  requireAdmin() {
    if (!this.isAdmin()) {
      window.location.href = '/dashboard';
      return false;
    }
    return true;
  }
};

window.Auth = Auth;
