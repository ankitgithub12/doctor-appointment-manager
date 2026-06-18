# HomeHub Homeopathy Clinic & Management Portal

HomeHub Homeopathy is a production-ready, full-stack MERN application for a clinical booking, patient dashboard, doctor dashboard, and administration management system. It uses **Firebase Authentication** for credentials and password resets, and keeps patient profiles, doctors, and scheduling stored in a Mongoose MongoDB database. It is built using React (Vite) styled with Tailwind CSS v4 on the frontend, and Node.js (Express) on the backend.

---

## Key Features

- **Multi-Role Dashboards**:
  - **Patient Portal**: Profile management (gender, DOB, emergency contacts, avatar uploads), appointment history tracker, review star-rating form modals, and bulk notifications inbox.
  - **Doctor Portal**: Availability hours scheduler, assigned appointment grids, review logs, patient history records, and profile bio setup.
  - **Admin Panel**: Manage doctor listings, moderate reviews, review callback inquiries, read contact inbox messages, update appointments (statuses/notes), edit system configurations, and view analytic metrics.
- **Firebase Authentication**: Integrated on the client and verified securely in the backend via Firebase Admin SDK. Includes an on-the-fly migration fallback system for legacy MongoDB credentials.
- **Transactional Forgot Password**: Password reset emails are triggered securely from the client side using Firebase's built-in email delivery infrastructure, removing local SMTP dependencies completely.
- **Media Uploads (Cloudinary Integration)**: Direct Cloudinary uploads using buffered memory storage streams via Multer, enabling optimized rendering of doctor photos, blog covers, and profile avatars.
- **Interactive Booking Flow**: Standalone bookings component supporting calendar future-date validations, prefilled patient contacts, and physician pre-selections.
- **Premium Aesthetic & React Icons**: Uses SVG primitives from the `react-icons/fa` library rather than emojis, featuring a dark-themed glassmorphism layout, consistent spacing, and custom micro-animations.
- **SEO & Search Optimization**: Page metadata overrides using `react-helmet-async`, structured schema business JSON-LD objects, XML sitemaps, and robots restrictions.
- **Production-grade Security**: Equipped with Firebase JWT verification, `express-mongo-sanitize`, `xss-clean` HTML filters, Helmet response headers, CORS protection, and strict path rate-limiters.

---

## Technology Stack

### Frontend (Client)
- **Core Framework**: React 18 & Vite
- **Authentication**: Firebase Client SDK
- **Styling**: Tailwind CSS v4
- **Routing**: React Router Dom v6
- **Icons**: React Icons (FontAwesome pack)
- **API Client**: Axios with interceptors
- **Notifications**: React Hot Toast

### Backend (Server)
- **Runtime**: Node.js & Express
- **Authentication**: Firebase Admin SDK
- **Database**: MongoDB & Mongoose ODM
- **Media Storage**: Cloudinary SDK
- **File Uploads**: Multer memory storage
- **Security & Logging**: Helmet, CORS, Express Rate Limit, Express Validator, Morgan, and BcryptJS (for legacy password verification)

---

## Project Structure

```
doctor-website/
├── client/                      # Frontend Application
│   ├── public/                  # Robots.txt, sitemap.xml, static assets
│   ├── src/
│   │   ├── api/                 # Axios configuration & services.js
│   │   ├── components/          # Reusable UI primitives (Modal, Skeleton, Badges)
│   │   ├── context/             # Global Auth state context (Firebase & Legacy fallbacks)
│   │   ├── lib/
│   │   │   └── firebase.js      # Firebase Client SDK initializer
│   │   ├── pages/               # Page routing views
│   │   │   ├── admin/           # Admin layout & sub-pages (doctors, reviews, settings)
│   │   │   ├── doctor/          # Doctor layout & sub-pages (availability, appointments)
│   │   │   ├── patient/         # Patient layout & sub-pages (profile, reviews, alerts)
│   │   │   ├── BookAppointmentPage.jsx
│   │   │   ├── DoctorDetailPage.jsx
│   │   │   ├── BlogPage.jsx
│   │   │   └── ...
│   │   ├── App.jsx              # Role-guarded routing tree mappings
│   │   └── index.css            # Tailwind variables & global animations
│   ├── vite.config.js
│   └── package.json
│
├── server/                      # Backend API Server
│   ├── config/                  # Database connection, Cloudinary, & Firebase Admin setup
│   ├── controllers/             # Endpoint action handlers (MVC Controllers)
│   ├── middleware/              # Auth checks, sanitizers, limits, and error handlers
│   ├── models/                  # Mongoose data schemas (MVC Models)
│   ├── routes/                  # Express endpoints mappings (MVC Views)
│   ├── seed/                    # Initial database populator scripts
│   ├── services/                # Cloudinary uploads service
│   ├── utils/                   # Standardized apiResponse and pagination helpers
│   ├── validations/             # Express-validator schemas
│   ├── server.js                # App entry bootstrap
│   ├── app.js                   # Express application setup
│   ├── .env                     # Server local env configuration
│   ├── .gitignore               # Server-specific Git ignore paths
│   └── package.json
│
├── .gitignore                   # Workspace Git ignore paths
├── README.md                    # Project documentation
└── ...
```

---

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/goklyn01/doctor-
cd doctor-
```

### 2. Configure Environment Variables
Create a `.env` file inside the `server/` directory:
```bash
touch server/.env
```
Fill in the configuration parameters inside `server/.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_token
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----\n"
```

Create a `.env` file inside the `client/` directory for Vite & Firebase client:
```env
VITE_API_URL=http://localhost:5000/api

# Firebase client-side config
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Install Dependencies
Install dependencies for both frontend and backend directories:
```bash
# Install frontend packages
cd client
npm install

# Install backend packages
cd ../server
npm install
```

### 4. Seed Database Data
Initialize the database with sample admin, patient, doctors, reviews, and clinical treatments:
```bash
cd server
npm run seed
```
*Note: A default admin user will be created with username `admin@homehub.com` and password `Admin@123`.*

---

## Running the Application Locally

Start both the client and server application servers in separate terminal windows:

### Run Backend
```bash
cd server
npm run dev
```
The server will start running on `http://localhost:5000`.

### Run Frontend
```bash
cd client
npm run dev
```
The client website will start running on `http://localhost:5173`.

---

## Production Build

To build the React application for deployment:
```bash
cd client
npm run build
```
Vite will compile the code and generate the output bundle inside the `client/dist/` directory.
