import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:5000/api',
  withCredentials: true, // send httpOnly cookie on every request
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — normalize errors
client.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      error.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default client;
