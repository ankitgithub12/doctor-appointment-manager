import axiosClient from './axios.js';

// Authentication API
export const authService = {
  register: (userData) => axiosClient.post('/auth/register', userData),
  login: (credentials) => axiosClient.post('/auth/login', credentials),
  getMe: () => axiosClient.get('/auth/me'),
};

// Doctors API
export const doctorService = {
  getDoctors: () => axiosClient.get('/doctors'),
  getDoctor: (id) => axiosClient.get(`/doctors/${id}`),
  createDoctor: (doctorData) => axiosClient.post('/doctors', doctorData),
  updateDoctor: (id, doctorData) => axiosClient.put(`/doctors/${id}`, doctorData),
  deleteDoctor: (id) => axiosClient.delete(`/doctors/${id}`),
};

// Appointments API
export const appointmentService = {
  createAppointment: (appointmentData) => axiosClient.post('/appointments', appointmentData),
  getAppointments: () => axiosClient.get('/appointments'),
  getMyAppointments: () => axiosClient.get('/appointments/my'),
  updateStatus: (id, statusData) => axiosClient.patch(`/appointments/${id}/status`, statusData),
  deleteAppointment: (id) => axiosClient.delete(`/appointments/${id}`),
};

// Treatments API
export const treatmentService = {
  getTreatments: () => axiosClient.get('/treatments'),
  getTreatment: (slug) => axiosClient.get(`/treatments/${slug}`),
  createTreatment: (treatmentData) => axiosClient.post('/treatments', treatmentData),
  updateTreatment: (id, treatmentData) => axiosClient.put(`/treatments/id/${id}`, treatmentData),
  deleteTreatment: (id) => axiosClient.delete(`/treatments/id/${id}`),
};

// Reviews API
export const reviewService = {
  getReviews: () => axiosClient.get('/reviews'),
  getAllReviews: () => axiosClient.get('/reviews/all'),
  createReview: (reviewData) => axiosClient.post('/reviews', reviewData),
  approveReview: (id, isApproved) => axiosClient.patch(`/reviews/${id}/approve`, { isApproved }),
  deleteReview: (id) => axiosClient.delete(`/reviews/${id}`),
};

// Consultations API
export const consultationService = {
  createConsultation: (consultationData) => axiosClient.post('/consultations', consultationData),
  getConsultations: () => axiosClient.get('/consultations'),
  updateStatus: (id, status) => axiosClient.patch(`/consultations/${id}/status`, { status }),
  deleteConsultation: (id) => axiosClient.delete(`/consultations/${id}`),
};

// Contact Messages API
export const contactService = {
  createContact: (contactData) => axiosClient.post('/contact', contactData),
  getContacts: () => axiosClient.get('/contact'),
  markAsRead: (id, isRead) => axiosClient.patch(`/contact/${id}/read`, { isRead }),
  deleteContact: (id) => axiosClient.delete(`/contact/${id}`),
};

// Success Stories API
export const storyService = {
  getSuccessStories: () => axiosClient.get('/stories'),
  createStory: (storyData) => axiosClient.post('/stories', storyData),
  updateStory: (id, storyData) => axiosClient.put(`/stories/${id}`, storyData),
  deleteStory: (id) => axiosClient.delete(`/stories/${id}`),
};

// Dashboard Stats API
export const statsService = {
  getDashboardStats: () => axiosClient.get('/stats/dashboard'),
};
