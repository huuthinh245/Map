import { create } from 'apisauce';

const api = create({
    baseURL: 'http://10.86.222.82:9001/HanhChinhService.svc/KD/',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
});

export default api;
