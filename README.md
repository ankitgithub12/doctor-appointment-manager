# HomeHub Homeopathy Clinic & Management Portal

HomeHub Homeopathy is a production-ready, full-stack MERN application for a clinical booking, patient dashboard, and administration management system. It is built using React (Vite) styled with Tailwind CSS v4 on the frontend, and Node.js (Express) with MongoDB on the backend.

---

## Key Features

- **Patient Portal & Authentication**: Secure registration and login using JWT. Patients can view upcoming appointments, booking history, and assigned homeopathic physician details.
- **Interactive Booking Flow**: Real-time appointment scheduling and free callback consultation requests.
- **Admin Dashboard**: Comprehensive administration panel to manage appointments (approve, mark complete, add clinical notes), CRUD operations on clinic doctors and treatment modules, review moderation, and callback queries.
- **Clinical Specializations Directory**: Structured pages detailing treatments, symptoms, and healing timelines.
- **Tailwind CSS v4 Aesthetic**: Modern glassmorphic theme with responsive layouts, hover states, and smooth transition animations.
- **SEO & Search Optimization**: Unique meta tags, Open Graph card tags, sitemaps, and structured JSON-LD local medical business schemas.
- **Security Protocols**: Armed with rate limiting, Helmet security headers, CORS protection, request parameter validations, and password crypt hashing.

---

## Technology Stack

### Frontend (Client)
- **Core Framework**: React 18 & Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router Dom v6
- **API Client**: Axios with automatic request/response token interceptors
- **Notifications**: React Hot Toast

### Backend (Server)
- **Runtime**: Node.js & Express
- **Database**: MongoDB & Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with expiration
- **Security & Logging**: Helmet, CORS, Express Rate Limit, Express Validator, Morgan, and BcryptJS

---

## Project Structure

```
doctor-website/
├── client/                      # Frontend Application
│   ├── public/                  # Robots.txt, sitemaps, static files
│   ├── src/
│   │   ├── api/                 # Axios configurations & service endpoints
│   │   ├── components/          # Reusable UI primitives & layouts
│   │   ├── context/             # Global Auth state context
│   │   ├── pages/               # Page routing views (About, Contact, Admin, etc.)
│   │   ├── App.jsx              # Routing mapping
│   │   └── index.css            # Tailwind import & color scheme variables
│   ├── vite.config.js
│   └── package.json
│
├── server/                      # Backend API Server
│   ├── config/                  # Database connections
│   ├── controllers/             # Endpoint action handlers
│   ├── middleware/              # Auth sessions, validations, and error handlers
│   ├── models/                  # Mongoose data schemas
│   ├── routes/                  # Express routing files
│   ├── seed/                    # Initial database populator scripts
│   ├── server.js                # App entry point
│   └── package.json
│
├── .env                         # Root local environment variables (ignored in Git)
├── .env.example                 # Reference environment variables
└── .gitignore                   # Workspace files to ignore in Git
```

---

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/goklyn01/doctor-
cd doctor-
```

### 2. Configure Environment Variables
Copy `.env.example` at the root and rename it to `.env`:
```bash
cp .env.example .env
```
Fill in the configuration parameters inside the root `.env` file:
- `MONGODB_URI`: Your MongoDB database connection string.
- `JWT_SECRET`: A secure string used to sign user auth tokens.
- `PORT`: Port the Express server will run on (Default: `5000`).

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
