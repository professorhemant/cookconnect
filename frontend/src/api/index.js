import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Menu
export const getMenuItems = (params = {}) => api.get('/menu', { params });
export const getMenuByType = (type, params = {}) => api.get(`/menu/${type}`, { params });
export const getMenuItemById = (id) => api.get(`/menu/${id}`);
export const createMenuItem = (data) => api.post('/menu', data);
export const updateMenuItem = (id, data) => api.put(`/menu/${id}`, data);
export const deleteMenuItem = (id) => api.delete(`/menu/${id}`);

// Family
export const getFamilyMembers = (userId) => api.get(`/family/${userId}`);
export const addFamilyMember = (data) => api.post('/family', data);
export const updateFamilyMember = (id, data) => api.put(`/family/${id}`, data);
export const deleteFamilyMember = (id) => api.delete(`/family/${id}`);
export const getFamilyNutrition = (memberId) => api.get(`/family/${memberId}/nutrition`);

// Plans
export const generateDietPlan = (data) => api.post('/plans/generate', data);
export const getPlans = (userId) => api.get(`/plans/${userId}`);
export const getFullPlan = (planId) => api.get(`/plans/${planId}/full`);
export const getTodayMenu = (userId) => api.get(`/plans/today/${userId}`);
export const updatePlanDay = (planId, dayId, data) => api.put(`/plans/${planId}/day/${dayId}`, data);
export const deletePlan = (planId) => api.delete(`/plans/${planId}`);

// Nutrition
export const getNutritionRequirements = () => api.get('/nutrition/requirements');
export const getNutritionForProfile = (age, gender, activity) => api.get(`/nutrition/requirements/${age}/${gender}/${activity}`);
export const getFamilySummary = (userId) => api.get(`/nutrition/family-summary/${userId}`);

// Notifications
export const sendTodayMenu = (userId) => api.post(`/notifications/send-today/${userId}`);
export const sendWeekMenu = (userId) => api.post(`/notifications/send-week/${userId}`);
export const getNotificationHistory = (userId) => api.get(`/notifications/history/${userId}`);

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getProfile = (userId) => api.get(`/auth/profile/${userId}`);
export const updateProfile = (userId, data) => api.put(`/auth/profile/${userId}`, data);

export default api;
