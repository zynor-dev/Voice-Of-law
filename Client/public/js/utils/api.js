/**
 * API Client — Axios wrapper with JWT interceptor
 */

const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api/v1'
  : '/api/v1';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE;
  }

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('vol_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  async request(method, endpoint, data = null, isFormData = false) {
    const url = `${this.baseURL}${endpoint}`;
    const options = {
      method,
      headers: isFormData ? {} : this.getHeaders(),
    };

    if (isFormData) {
      const token = localStorage.getItem('vol_token');
      if (token) options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
      options.body = isFormData ? data : JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      if (response.status === 401) {
        localStorage.removeItem('vol_token');
        localStorage.removeItem('vol_user');
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        throw { status: response.status, ...result };
      }

      return result;
    } catch (error) {
      if (error.status) throw error;
      throw { success: false, message: 'Network error. Please check your connection.' };
    }
  }

  get(endpoint) { return this.request('GET', endpoint); }
  post(endpoint, data) { return this.request('POST', endpoint, data); }
  put(endpoint, data) { return this.request('PUT', endpoint, data); }
  patch(endpoint, data) { return this.request('PATCH', endpoint, data); }
  delete(endpoint) { return this.request('DELETE', endpoint); }
  upload(endpoint, formData) { return this.request('POST', endpoint, formData, true); }
  uploadPut(endpoint, formData) { return this.request('PUT', endpoint, formData, true); }
}

window.api = new ApiClient();
