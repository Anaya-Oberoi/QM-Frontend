import axios from 'axios';
import { API_BASE_URL } from '../config/env';

export const API_BASE = API_BASE_URL;
const BASE_URL = `${API_BASE}/api/v1`;
const TOKEN_KEY = 'qm_token';

function getToken() { return localStorage.getItem(TOKEN_KEY); }
function setToken(token) { token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY); }
function clearToken() { setToken(null); }
export { getToken, setToken, clearToken };

const apiClient = axios.create({ baseURL: BASE_URL, headers: { 'Content-Type': 'application/json' } });

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.response?.data?.error || error.message || 'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

// ── AUTH ──
export async function register(name, email, password) {
  const data = await apiClient.post('/auth/register', { name, email, password });
  if (data?.accessToken) setToken(data.accessToken);
  return data;
}

export async function login(email, password) {
  const data = await apiClient.post('/auth/login', { email, password });
  if (data?.accessToken) setToken(data.accessToken);
  return data;
}

export async function getProfile() {
  return apiClient.get('/auth/me');
}

// ── OTP (real backend calls) ──
export async function sendOtp(email) {
  return apiClient.post('/auth/otp/send', { email });
}

export async function verifyOtp(email, otp) {
  return apiClient.post('/auth/otp/verify', { email, otp });
}

// ── PASSWORD ──
export async function forgotPassword(email, newPassword) {
  return apiClient.put(`/auth/forgotPassword/${encodeURIComponent(email)}`, { password: newPassword });
}

export async function resetPassword(email, currentPassword, newPassword) {
  return apiClient.put(`/auth/resetPassword/${encodeURIComponent(email)}`, null, { params: { currentPassword, newPassword } });
}

// ── QUANTITIES ──
export async function measure(operation, dto) {
  return apiClient.post(`/quantities/${operation}`, dto);
}

export async function historyByOperation(operation) {
  return apiClient.get(`/quantities/history/operation/${operation}`);
}

export async function historyByType(measurementType) {
  return apiClient.get(`/quantities/history/type/${measurementType}`);
}

export async function operationCount(operation) {
  return apiClient.get(`/quantities/count/${operation}`);
}
