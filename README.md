<div align="center">
  <h1>🏋️‍♂️ FitAI - Your Personal Health & Fitness AI Companion</h1>
  <p>An intelligent, full-stack web application designed to track, analyze, and optimize your fitness journey using AI.</p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="NodeJS" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  </p>
</div>

---

## 🌟 Overview
FitAI is a comprehensive MERN stack application designed to help users achieve their fitness goals. It features an interactive dashboard, personal health tracking, workout & diet logging, AI-driven insights, and a seamless profile management system with photo uploads. 

Whether you are a beginner trying to start your fitness journey or an advanced developer looking to contribute to a scalable architecture, FitAI has something for you!

---

## ✨ Features
- **🔐 Secure Authentication:** JWT-based login, signup, and password reset.
- **👤 Profile Management:** Complete health profiles (BMI, height, weight) with camera/gallery photo uploads via Cloudinary.
- **📊 Interactive Dashboard:** Track your daily calories, workouts, and health vitals.
- **🤖 AI Integration:** Get personalized fitness and diet recommendations.
- **📱 Responsive UI:** Beautiful, modern interface built with React & Tailwind CSS.

---

## 🚀 Beginner's Guide: Getting Started

Follow these simple steps to run this project on your local machine.

### 1️⃣ Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Git](https://git-scm.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or Atlas URI)

### 2️⃣ Clone the Repository
Open your terminal and run:
```bash
git clone https://github.com/arpit168/HealthNexus-Your-Journey-to-Better-Health.git
cd FitAI
```

### 3️⃣ Install Dependencies
You need to install packages for both the **backend** and **frontend**.
```bash
# Install backend dependencies
cd backend
npm install

# Open a new terminal, and install frontend dependencies
cd ../frontend
npm install
```

### 4️⃣ Environment Variables (`.env`)
Create a `.env` file in **both** the `backend` and `frontend` folders. 

**Backend `.env`** (Place in `FitAI/backend/.env`)
```env
PORT=4500
MONGO_URI=mongodb://localhost:27017/HealthNexus
JWT_SECRET=your_super_secret_jwt_key
CLOUDNARY_CLOUD_NAME=your_cloud_name
CLOUDNARY_API_KEY=your_api_key
CLOUDNARY_API_SECRET=your_api_secret
GROQ_API_KEY=your_groq_api_key
```

**Frontend `.env`** (Place in `FitAI/frontend/.env`)
```env
VITE_API_URL=http://localhost:4500/api
```

### 5️⃣ Run the Application
Start both servers to see the magic happen!

**Start the Backend:**
```bash
cd backend
npm run dev
```

**Start the Frontend:**
```bash
cd frontend
npm run dev
```
Open your browser and navigate to `http://localhost:5173`. 🚀

---

## 💻 Advanced Guide: Architecture & Structure

For developers looking to dive deep into the codebase, FitAI follows a clean, modular MERN architecture.

### 📂 Folder Structure
```text
FitAI/
│
├── backend/                  # Node.js & Express Backend
│   ├── src/
│   │   ├── config/           # DB, Cloudinary & API configs
│   │   ├── controllers/      # Route logic (Auth, User, Tracking, etc.)
│   │   ├── middlewares/      # JWT protection, Error handlers
│   │   ├── models/           # Mongoose schemas (User, Workouts, etc.)
│   │   ├── routers/          # Express route definitions
│   │   └── utils/            # Helper functions
│   ├── server.js             # Entry point
│   └── package.json
│
└── frontend/                 # React (Vite) Frontend
    ├── src/
    │   ├── assets/           # Images, Icons
    │   ├── components/       # Reusable UI components (Modals, Cards)
    │   ├── config/           # Axios interceptors & API config
    │   ├── context/          # React Context (Auth, Theme)
    │   ├── pages/            # Page Views (Dashboard, Profile, Auth)
    │   │   └── Dashboard/
    │   │       └── Profile/  # Sub-components for Profile (PhotoUpload, etc.)
    │   ├── Services/         # API call wrappers (profileService, etc.)
    │   ├── App.jsx           # Main Router setup
    │   └── main.jsx          # React DOM render
    ├── index.html
    ├── tailwind.config.js    # Tailwind customizations
    └── package.json
```

### 🛠️ Tech Stack Deep Dive
- **Frontend State Management:** React Hooks (`useState`, `useEffect`) and Context API.
- **Styling:** Tailwind CSS with Framer Motion for micro-animations and smooth transitions.
- **API Communication:** Axios with configured interceptors for automatic JWT attachment.
- **Backend Architecture:** MVC pattern. Controllers handle business logic, separated from routing.
- **Media Uploads:** Handled via `multer` in memory, piped via Node Streams directly to `Cloudinary` to avoid disk writes and base64 parsing limits.

### 🔌 Key API Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login user and receive JWT | ❌ |
| `GET` | `/api/userData/profile` | Fetch complete user profile data | ✅ |
| `PATCH` | `/api/user/update-profile`| Update general health/profile info | ✅ |
| `PATCH` | `/api/user/changePhoto` | Upload a new profile picture (multipart) | ✅ |

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  <p>Made with ❤️ for a healthier tomorrow.</p>
</div>
