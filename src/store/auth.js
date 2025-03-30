import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null
  }),
  actions: {
    async login(credentials) {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/login', credentials);
        this.token = response.data.token;
        this.user = response.data.user;
        localStorage.setItem('token', this.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      } catch (error) {
        throw error.response.data.message;
      }
    },
    async register(data) {
      try {
        return await axios.post('http://127.0.0.1:8000/api/register', data);
      } catch (error) {
        throw error.response.data.message;
      }
    },
    async logout() {
      try {
        await axios.post('http://127.0.0.1:8000/api/logout');
        this.user = null;
        this.token = null;
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } catch (error) {
        throw error.response.data.message;
      }
    },
    async fetchUser() {
      if (!this.token) return;
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user');
        this.user = response.data;
      } catch (error) {
        this.logout();
      }
    }
  }
});
