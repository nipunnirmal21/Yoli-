import axios from 'axios';

// මේක තමයි නියම පාලම. මෙතැනට අනිවාර්යයෙන්ම Render URL එක දෙන්න ඕනේ.
const api = axios.create({
    baseURL: 'https://yoli-backend.onrender.com/api'
});

export const fetchProducts = (params = {}) =>
    api.get('/products', { params }).then((r) => r.data?.products ?? []);

// ... අනෙක් fetch functions ටිකත් මේ විදිහටම තියන්න
export default api;
