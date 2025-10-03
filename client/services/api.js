import axios from 'axios';

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:4000';

const api = axios.create({ baseURL });

export default api;


