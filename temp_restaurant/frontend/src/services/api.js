import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const loginUser = async (credentials) => {
  return axios.post(`${API_URL}/users/login`, credentials);
};

export const getUsers = async () => {
  return axios.get(`${API_URL}/users/`);
};

export const createUser = async (userData) => {
  return axios.post(`${API_URL}/users/`, userData);
};

export const updateUser = async (id, userData) => {
  return axios.put(`${API_URL}/users/${id}/`, userData);
};

export const deleteUser = async (id) => {
  return axios.delete(`${API_URL}/users/${id}/`);
};

export const getTables = async () => {
  return axios.get(`${API_URL}/tables`);
};

export const createTable = async (tableData) => {
  return axios.post(`${API_URL}/tables`, tableData);
};

export const updateTable = async (id, tableData) => {
  return axios.put(`${API_URL}/tables/${id}`, tableData);
};

export const deleteTable = async (id) => {
  return axios.delete(`${API_URL}/tables/${id}`);
};

export const getMenuItems = async () => {
  return axios.get(`${API_URL}/menu`);
};

export const getMenuItemsByCategory = async (category) => {
  return axios.get(`${API_URL}/menu/category/${category}`);
};

export const createMenuItem = async (itemData) => {
  return axios.post(`${API_URL}/menu`, itemData);
};

export const updateMenuItem = async (id, itemData) => {
  return axios.put(`${API_URL}/menu/${id}`, itemData);
};

export const deleteMenuItem = async (id) => {
  return axios.delete(`${API_URL}/menu/${id}`);
};

export const uploadMenuImage = async (formData) => {
  return axios.post(`${API_URL}/menu/upload-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const createOrder = async (orderData) => {
  return axios.post(`${API_URL}/orders`, orderData);
};

export const getOrder = async (id) => {
  return axios.get(`${API_URL}/orders/${id}`);
};

export const getOrdersByTable = async (tableId) => {
  return axios.get(`${API_URL}/orders/table/${tableId}`);
};

export const getReports = async (dateRange) => {
  return axios.get(`${API_URL}/reports?date_range=${dateRange}`);
};

export const getAdminStats = async () => {
  return axios.get(`${API_URL}/admin/stats`);
};

export const getSalesReport = async (dateRange) => {
  const response = await axios.get(`${API_URL}/reports/sales?date_range=${dateRange}`);
  return response.data;
};

export const getTableReport = async (dateRange) => {
  const response = await axios.get(`${API_URL}/reports/tables?date_range=${dateRange}`);
  return response.data;
};

export const getServerReport = async (dateRange) => {
  const response = await axios.get(`${API_URL}/reports/servers?date_range=${dateRange}`);
  return response.data;
};

export const getServers = async () => {
  return axios.get(`${API_URL}/users/?role=server`);
}; 