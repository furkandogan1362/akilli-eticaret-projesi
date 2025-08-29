// frontend/src/api/axiosConfig.js

import axios from 'axios';

// Backend API'mizin temel URL'i
const BASE_URL = 'http://127.0.0.1:5000/api';

// Axios'un yeni bir örneğini (instance) oluşturuyoruz
const api = axios.create({
  baseURL: BASE_URL,
});

// Axios Interceptor (Araya Girici)
// Bu kod bloğu, uygulamadan dışarı giden HER isteği yakalar
// ve isteği göndermeden hemen önce içine bir şey eklememizi sağlar.
api.interceptors.request.use(
  (config) => {
    // localStorage'dan token'ı oku
    const token = localStorage.getItem('token');

    // Eğer token varsa...
    if (token) {
      // İsteğin header'larına 'Authorization' başlığını ekle
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config; // Değiştirilmiş isteği geri döndür
  },
  (error) => {
    // Bir hata olursa, hatayı işle
    return Promise.reject(error);
  }
);

export default api;