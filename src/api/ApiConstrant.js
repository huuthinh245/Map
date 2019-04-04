import { create } from 'apisauce';

const api = create({
  baseURL: 'http://10.86.222.82:9001/HanhChinhService.svc/KD/',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});


export const callApi =  {
  GET: (url, params, config) => api.get(url, params || {}, config || {}),
  POST: (url, params, config) => api.post(url, params || {}, config || {}),
  DELETE: (url, params, config) => api.delete(url, params || {}, config || {}),
}
