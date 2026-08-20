import axios from 'axios';

// සයිට් එක සහ Render Backend එක යා කරන පාලම 🚀
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('adminToken');
            window.location.href = '/admin-login';
        }
        return Promise.reject(error);
    }
);

export const fetchProducts = (params = {}) =>
    api.get('/products', { params }).then((r) => r.data?.products ?? []);

export const fetchProductById = (id) =>
    api.get(`/products/${id}`).then((r) => r.data?.product ?? null);

export const fetchCategories = () =>
    api.get('/products/categories').then((r) => r.data?.categories ?? []);

export const fetchShop = (slug) =>
    api.get(`/shops/${slug}`).then((r) => r.data ?? {});

export default api;