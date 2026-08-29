# Career Route 🚀

## Overview
Career Route is a complete, production-ready, full-stack MERN web application. It allows users to upload their resume, automatically extract and detect technical skills, and compare them against their desired career paths. Based on the skill gap, the system generates a personalized, step-by-step learning roadmap.

This project relies purely on a deterministic, rule-based skill detection algorithm and internal database, requiring NO paid AI APIs (like OpenAI) to function.

## Features
- **User Authentication:** Secure JWT-based registration and login.
- **Resume Upload:** Drag-and-drop PDF upload with memory-storage for Vercel compatibility.
- **Skill Extraction:** Built-in PDF parsing and skill matching.
- **Career Selection:** Pre-loaded careers with detailed requirements.
- **Skill Gap Analysis:** Calculates a readiness score and identifies matched vs. missing skills.
- **Personalized Roadmap:** Generates an actionable learning plan based on missing skills.
- **Progress Tracking:** Interactive roadmaps that save completion status.

## Technology Stack
- **Frontend:** React.js, Vite, React Router DOM, Tailwind CSS, Axios, Lucide React
- **Backend:** Node.js, Express.js, MongoDB Atlas (Mongoose), JWT, bcryptjs, multer, pdf-parse
- **Deployment-Ready:** Fully compatible with Vercel and MongoDB Atlas.

## Project Structure
```text
career-route/
├── client/                 # Frontend React Application (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth)
│   │   ├── pages/          # Application routes/pages
│   │   ├── services/       # API configuration
│   │   ├── App.jsx         # Main router
│   │   └── main.jsx        # Entry point
│   ├── .env.example
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                 # Backend Express Application
│   ├── config/             # Database connection
│   ├── controllers/        # Route controllers
│   ├── data/               # Skill, Career, and Roadmap databases
│   ├── middleware/         # Auth and Error handlers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express API routes
│   ├── utils/              # Skill detection logic
│   ├── app.js              # Express app setup (Vercel safe)
│   ├── server.js           # Local development server
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── package.json            # Root scripts
└── README.md
```

## Local Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd career-route
   ```

2. **Install all dependencies (Root, Client, and Server):**
   ```bash
   npm run install-all
   ```

## Environment Variables

### Server (`server/.env`)
Create a `.env` file inside the `server/` directory using `server/.env.example` as a template:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`)
Create a `.env` file inside the `client/` directory using `client/.env.example` as a template:
```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

To run both the client and server concurrently from the root directory:
```bash
npm run dev
```
- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000`

Alternatively, run them in separate terminals:
- Terminal 1: `cd server && npm run dev`
- Terminal 2: `cd client && npm run dev`

## MongoDB Atlas Setup
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Database Access**, create a user with a strong password.
3. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`).
4. Click **Connect**, choose "Connect your application", and copy the connection string.
5. Replace `<password>` with your user password and add it to `server/.env`.

## Deployment (Vercel)

For simplicity and best performance, it's recommended to deploy the Client and Server as two separate projects on Vercel (or Vercel for Client + Render/Railway for Server).

### Frontend Deployment
1. Import the `career-route` repository to Vercel.
2. Set the **Root Directory** to `client`.
3. Set the Environment Variable: `VITE_API_URL` = `https://your-backend-url.com/api`
4. Deploy.

### Backend Deployment (Serverless via Vercel)
To deploy the backend on Vercel, ensure you have a `vercel.json` file in your root that redirects traffic to the Express app. 
If deploying *only* the server folder as an API:
1. Import the repository, set **Root Directory** to `server`.
2. Add Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` (your frontend domain).
3. Ensure `server/api/index.js` or `vercel.json` points to `app.js`.

## API Overview
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/me` - Get current user profile
- `POST /api/resume/upload` - Upload and parse PDF (Requires Auth)
- `GET /api/careers` - Get list of careers
- `POST /api/analysis` - Generate gap analysis
- `GET /api/analysis/latest` - Get user's latest analysis
- `GET /api/roadmap/:career/:skill` - Get roadmap steps
- `POST /api/roadmap/progress` - Save step progress
