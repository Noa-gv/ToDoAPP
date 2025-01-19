import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5070';

// הוספת interceptor לתפיסת שגיאות ב-response
axios.interceptors.response.use(
  response => response, // אם התגובה מצליחה, מחזירים אותה כמו שהיא
  error => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// הוספת interceptor לפני כל בקשה להוסיף את הטוקן אם קיים
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // הוספת הטוקן לבקשה
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axios;

