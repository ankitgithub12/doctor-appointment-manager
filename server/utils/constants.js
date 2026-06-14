/**
 * Application-wide Constants
 */

export const ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
};

export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const APPOINTMENT_TYPE = {
  IN_PERSON: 'in-person',
  ONLINE: 'online',
  CALLBACK: 'callback',
};

export const CONSULTATION_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  CLOSED: 'closed',
};

export const NOTIFICATION_TYPE = {
  APPOINTMENT: 'appointment',
  REVIEW: 'review',
  SYSTEM: 'system',
  BLOG: 'blog',
};

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
};

export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
};
