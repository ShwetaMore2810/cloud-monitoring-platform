// frontend/src/api.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  // You may want to set timeout or other defaults here
});

export default {
  setToken: (t) => {
    if (t) instance.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    else delete instance.defaults.headers.common['Authorization'];
  },
  get: (url, opts) => instance.get(url, opts),
  post: (url, data, opts) => instance.post(url, data, opts),
  put: (url, data, opts) => instance.put(url, data, opts),
  delete: (url, opts) => instance.delete(url, opts),
  rawInstance: instance
};