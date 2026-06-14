/**
 * Input Sanitization Middleware
 * Protects against XSS and NoSQL injection attacks.
 */
import mongoSanitize from 'express-mongo-sanitize';

// Sanitize req.body, req.query, and req.params against NoSQL injection
export const sanitizeInput = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`[SECURITY] Sanitized input detected in ${key}`);
  },
});

// Simple XSS cleaner: strips <script> tags and event handlers
export const xssClean = (req, res, next) => {
  const clean = (obj) => {
    if (typeof obj === 'string') {
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/javascript\s*:/gi, '');
    }
    if (typeof obj === 'object' && obj !== null) {
      for (const key of Object.keys(obj)) {
        obj[key] = clean(obj[key]);
      }
    }
    return obj;
  };

  if (req.body) req.body = clean(req.body);
  if (req.query) req.query = clean(req.query);
  if (req.params) req.params = clean(req.params);

  next();
};
