import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Menu
export const getMenuItems = (params = {}) => api.get('/menu', { params });
export const getMenuByType = (type, params = {}) => api.get(`/menu/${type}`, { params });
export const getMenuItemById = (id) => api.get(`/menu/${id}`);
export const createMenuItem = (data) => api.post('/menu', data);
export const estimateNutrition = (data) => api.post('/menu/estimate-nutrition', data);
export const updateMenuItem = (id, data) => api.put(`/menu/${id}`, data);
export const deleteMenuItem = (id) => api.delete(`/menu/${id}`);

// Family
export const getFamilyMembers = (userId) => api.get(`/family/${userId}`);
export const addFamilyMember = (data) => api.post('/family', data);
export const updateFamilyMember = (id, data) => api.put(`/family/${id}`, data);
export const deleteFamilyMember = (id) => api.delete(`/family/${id}`);
export const getFamilyNutrition = (memberId) => api.get(`/family/${memberId}/nutrition`);

// Thali Planner
export const getThaliOptions = (data) => api.post('/menu/thali-options', data);

// Plans
export const generateDietPlan = (data) => api.post('/plans/generate', data);
export const getPlans = (userId) => api.get(`/plans/${userId}`);
export const getFullPlan = (planId) => api.get(`/plans/${planId}/full`);
export const getTodayMenu = (userId) => api.get(`/plans/today/${userId}`);
export const updatePlanDay = (planId, dayId, data) => api.put(`/plans/${planId}/day/${dayId}`, data);
export const addDayItem = (planId, dayId, data) => api.post(`/plans/${planId}/day/${dayId}/items`, data);
export const deleteDayItem = (planId, dayId, menuItemId, meal_type) => api.delete(`/plans/${planId}/day/${dayId}/items/${menuItemId}`, { params: { meal_type } });
export const deletePlan = (planId) => api.delete(`/plans/${planId}`);

// Nutrition
export const getNutritionRequirements = () => api.get('/nutrition/requirements');
export const getNutritionForProfile = (age, gender, activity) => api.get(`/nutrition/requirements/${age}/${gender}/${activity}`);
export const getFamilySummary = (userId) => api.get(`/nutrition/family-summary/${userId}`);

// Notifications
export const sendTodayMenu = (userId) => api.post(`/notifications/send-today/${userId}`);
export const sendWeekMenu = (userId) => api.post(`/notifications/send-week/${userId}`);
export const sendShoppingList = (userId) => api.post(`/notifications/send-shopping/${userId}`);
export const getNotificationHistory = (userId) => api.get(`/notifications/history/${userId}`);
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);

// PDF Preview
export const previewTodayPDF = (userId) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notifications/preview-today/${userId}`;
export const previewWeeklyPDF = (userId) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notifications/preview-weekly/${userId}`;
export const previewShoppingPDF = (userId) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notifications/preview-shopping/${userId}`;

// WhatsApp
export const getWhatsAppStatus = () => api.get('/whatsapp/status');
export const connectWhatsApp = () => api.post('/whatsapp/connect');
export const disconnectWhatsApp = () => api.post('/whatsapp/disconnect');

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getProfile = (userId) => api.get(`/auth/profile/${userId}`);
export const updateProfile = (userId, data) => api.put(`/auth/profile/${userId}`, data);

export default api;
