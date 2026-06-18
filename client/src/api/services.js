import axiosClient from './axios.js';

// Authentication API
export const authService = {
  register: (userData) => axiosClient.post('/auth/register', userData),
  login: (credentials) => axiosClient.post('/auth/login', credentials),
  loginLegacy: (credentials) => axiosClient.post('/auth/login-legacy', credentials),
  firebaseSync: (email) => axiosClient.post('/auth/firebase-sync', { email }),
  getMe: () => axiosClient.get('/auth/me'),
  updateProfile: (formData) => axiosClient.put('/auth/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updatePassword: (data) => axiosClient.put('/auth/password', data),
};

// Users API (Admin)
export const userService = {
  getUsers: (params) => axiosClient.get('/users', { params }),
  getUser: (id) => axiosClient.get(`/users/${id}`),
  updateUser: (id, data) => axiosClient.put(`/users/${id}`, data),
  deleteUser: (id) => axiosClient.delete(`/users/${id}`),
  toggleActive: (id) => axiosClient.patch(`/users/${id}/toggle-active`),
};

// Doctors API
export const doctorService = {
  getDoctors: (params) => axiosClient.get('/doctors', { params }),
  getDoctor: (id) => axiosClient.get(`/doctors/${id}`),
  createDoctor: (formData) => axiosClient.post('/doctors', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateDoctor: (id, formData) => axiosClient.put(`/doctors/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteDoctor: (id) => axiosClient.delete(`/doctors/${id}`),
  getDoctorAppointments: (id, params) => axiosClient.get(`/doctors/${id}/appointments`, { params }),
  updateAvailability: (id, data) => axiosClient.put(`/doctors/${id}/availability`, data),
};

// Appointments API
export const appointmentService = {
  createAppointment: (data) => axiosClient.post('/appointments', data),
  getAppointments: (params) => axiosClient.get('/appointments', { params }),
  getMyAppointments: (params) => axiosClient.get('/appointments/my', { params }),
  updateStatus: (id, data) => axiosClient.patch(`/appointments/${id}/status`, data),
  deleteAppointment: (id) => axiosClient.delete(`/appointments/${id}`),
};

// Treatments API
export const treatmentService = {
  getTreatments: () => axiosClient.get('/treatments'),
  getTreatment: (slug) => axiosClient.get(`/treatments/${slug}`),
  createTreatment: (data) => axiosClient.post('/treatments', data),
  updateTreatment: (id, data) => axiosClient.put(`/treatments/id/${id}`, data),
  deleteTreatment: (id) => axiosClient.delete(`/treatments/id/${id}`),
};

// Reviews API
export const reviewService = {
  getReviews: () => axiosClient.get('/reviews'),
  getMyReviews: (params) => axiosClient.get('/reviews/my', { params }),
  getAllReviews: (params) => axiosClient.get('/reviews/all', { params }),
  createReview: (data) => axiosClient.post('/reviews', data),
  approveReview: (id, isApproved) => axiosClient.patch(`/reviews/${id}/approve`, { isApproved }),
  deleteReview: (id) => axiosClient.delete(`/reviews/${id}`),
};

// Consultations API
export const consultationService = {
  createConsultation: (data) => axiosClient.post('/consultations', data),
  getConsultations: (params) => axiosClient.get('/consultations', { params }),
  updateStatus: (id, status) => axiosClient.patch(`/consultations/${id}/status`, { status }),
  deleteConsultation: (id) => axiosClient.delete(`/consultations/${id}`),
};

// Contact Messages API
export const contactService = {
  createContact: (data) => axiosClient.post('/contact', data),
  getContacts: (params) => axiosClient.get('/contact', { params }),
  markAsRead: (id, isRead) => axiosClient.patch(`/contact/${id}/read`, { isRead }),
  deleteContact: (id) => axiosClient.delete(`/contact/${id}`),
};

// Success Stories API
export const storyService = {
  getSuccessStories: () => axiosClient.get('/stories'),
  createStory: (data) => axiosClient.post('/stories', data),
  updateStory: (id, data) => axiosClient.put(`/stories/${id}`, data),
  deleteStory: (id) => axiosClient.delete(`/stories/${id}`),
};

// Dashboard Stats API
export const statsService = {
  getDashboardStats: () => axiosClient.get('/stats/dashboard'),
};

// Notifications API
export const notificationService = {
  getNotifications: (params) => axiosClient.get('/notifications', { params }),
  getUnreadCount: () => axiosClient.get('/notifications/unread-count'),
  markAsRead: (id) => axiosClient.patch(`/notifications/${id}/read`),
  markAllAsRead: () => axiosClient.patch('/notifications/read-all'),
  deleteNotification: (id) => axiosClient.delete(`/notifications/${id}`),
};

// Blogs API
export const blogService = {
  getBlogs: (params) => axiosClient.get('/blogs', { params }),
  getAllBlogs: (params) => axiosClient.get('/blogs/all', { params }),
  getBlog: (slug) => axiosClient.get(`/blogs/${slug}`),
  createBlog: (formData) => axiosClient.post('/blogs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateBlog: (id, formData) => axiosClient.put(`/blogs/id/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteBlog: (id) => axiosClient.delete(`/blogs/id/${id}`),
};

// Specializations API
export const specializationService = {
  getSpecializations: () => axiosClient.get('/specializations'),
  getAllSpecializations: () => axiosClient.get('/specializations/all'),
  createSpecialization: (data) => axiosClient.post('/specializations', data),
  updateSpecialization: (id, data) => axiosClient.put(`/specializations/${id}`, data),
  deleteSpecialization: (id) => axiosClient.delete(`/specializations/${id}`),
};

// Upload API
export const uploadService = {
  uploadDoctorPhoto: (formData) => axiosClient.post('/upload/doctor-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadBlogCover: (formData) => axiosClient.post('/upload/blog-cover', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadAvatar: (formData) => axiosClient.post('/upload/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};
