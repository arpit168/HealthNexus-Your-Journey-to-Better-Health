# Backend

Express API for the HealthNexus app. Handles auth, user management, AI features, and integrations with MongoDB, Cloudinary, Gmail, and Groq.

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- Cloudinary
- Nodemailer (Gmail)
- Groq SDK

## Requirements

- Node.js (LTS recommended)
- npm
- MongoDB connection string

## Setup

```bash
npm install
```

## Environment Variables

Create a `.env` file in this folder with the following values:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string

CLOUDNARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDNARY_API_KEY=your_cloudinary_api_key
CLOUDNARY_API_SECRET=your_cloudinary_api_secret

GMAIL_USER=your_gmail_address
GMAIL_PASSCODE=your_gmail_app_password

GROQ_API_KEY=your_groq_api_key
```

Notes:

- The Cloudinary keys use the `CLOUDNARY_` prefix (matching the code).
- For Gmail, use an app password if 2FA is enabled.

## Run

```bash
npm run dev
```

Or for production:

```bash
npm start
```

## Endpoints

- `GET /` health check
- `/auth/*` auth routes
- `/user/*` user routes
- `/api/v1/ai/*` AI routes

## Project Structure

```
src/
	config/
	controllers/
	middlewares/
	models/
	routers/
	utils/
```

## CORS

The server allows requests from http://localhost:5173. Update this in `server.js` if your frontend runs elsewhere.
