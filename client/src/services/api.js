import axios from 'axios';

// සයිට් එක සහ Backend එක යා කරන පාලම මෙන්න මෙතැනයි
const api = axios.create({
    baseURL: 'https://yoli-backend.onrender.com/api'
});

export const fetchProducts = (params = {}) =>
    api.get('/products', { params }).then((r) => r.data?.products ?? []);

export const fetchProductById = (id) =>
    api.get(`/products/${id}`).then((r) => r.data?.product ?? null);

export const fetchCategories = () =>
    api.get('/products/categories').then((r) => r.data?.categories ?? []);

export const fetchShop = (slug) =>
    api.get(`/shops/${slug}`).then((r) => r.data ?? {});

export default api;