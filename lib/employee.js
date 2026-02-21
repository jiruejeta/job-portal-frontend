import api from './api';

export const employeeAPI = {
  // Get employee profile for logged-in user
  getProfile: () => api.get('/employee/profile'),
  
  // Upload photo
  uploadPhoto: (photoData) => api.post('/employee/photo', { photo: photoData }),
};