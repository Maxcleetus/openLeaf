# OpenLeaf

OpenLeaf is a full-stack book sharing and discussion platform with:
- `frontend`: user-facing React app
- `adminpanel`: admin dashboard for managing books/discussions/comments
- `backend`: Express + MongoDB API with Cloudinary media upload and Gemini-powered study guide email generation

## Repository Structure

```text
openLeaf/
  frontend/      # Main user app (Vite + React)
  adminpanel/    # Admin app (Vite + React)
  backend/       # API server (Express + MongoDB)
```

## Tech Stack

- Frontend/Admin: React, Vite, Tailwind CSS
- Backend: Node.js, Express, MongoDB (Mongoose)
- Media: Cloudinary
- Auth: JWT
- AI : Gemini API

## Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas/local MongoDB
- Cloudinary account
- Gmail app password (for Nodemailer)
- Gemini API key

## Setup

### 1) Clone and install dependencies

```bash
git clone <your-repo-url>
cd openLeaf

cd backend && npm install
cd ../frontend && npm install
cd ../adminpanel && npm install
```

### 2) Configure backend environment

Create `backend/.env`:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string

CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

ADMIN_USERNAME=admin
ADMIN_PASSWORD=password
JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key
```

### 3) Run services

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Admin panel:

```bash
cd adminpanel
npm run dev
```

## Important Note for Local Backend

In `backend/server.js`, `app.listen(...)` is currently commented out.  
If you want to run the API directly with `npm run dev`, uncomment the `app.listen` block.

## Main API Routes

- `GET /api/common/details` - fetch all books
- `POST /api/common/login` - admin login
- `POST /api/common/addBook` - add a book
- `PUT /api/common/book/:id` - update a book
- `DELETE /api/common/book/:id` - delete a book
- `POST /api/common/chat-response` - chatbot text response (Gemini via backend)
- `GET /api/discussions` - list discussions
- `POST /api/discussions` - create discussion

## Deployment

Each app contains a `vercel.json` and is designed for Vercel deployment.

## Current Defaults in Frontend/Admin

Frontend and admin currently call:
- `https://open-leaf.vercel.app/api/common/...`
- `https://open-leaf.vercel.app/api/discussions...`

For local development, update those API base URLs to your local backend URL.
