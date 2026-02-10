# Project Guide

This repo contains a **Next.js frontend** and a **Node.js/Express backend** with MongoDB.

## Structure
- `frontend/` Next.js app (UI screens per feature)
- `backend/` Express API (separate routes/controllers/services per feature)

## Setup
### Backend
1. Create `.env` in `backend/` using `backend/.env.example`.
2. Install deps (already installed):
   - `npm install`
3. Run:
   - `npm run dev`

### Frontend
1. Create `.env.local` in `frontend/` using `frontend/.env.example`.
2. Run:
   - `npm run dev`

## Key Environment Variables
### Backend
- `MONGODB_URI` Mongo connection string
- `JWT_SECRET` JWT signing key
- `GEMINI_API_KEY` Gemini API key
- `DEEPSEEK_API_KEY` DeepSeek fallback key (optional)
- `RESEND_API_KEY` Resend API key
- `RESEND_FROM_EMAIL` Verified sender email
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` for Google OAuth
- `TRENDING_JOBS_API_URL` optional external API
- `FRONTEND_URL` frontend base URL for OAuth redirects

### Frontend
- `NEXT_PUBLIC_API_URL` backend base URL (default `http://localhost:5000`)

## Backend API Endpoints
- `POST /api/auth/signup`
- `POST /api/auth/verify-otp`
- `POST /api/auth/login`
- `GET /api/auth/google`
- `GET /api/auth/google/callback`

- `POST /api/resume-analysis/analyze` (multipart: `resume` file + `jobTitle`)
- `POST /api/resume-generator/generate`
- `GET /api/trending-jobs`
- `GET /api/dashboard`
- `GET /api/career/suggestions`

All feature endpoints require `Authorization: Bearer <token>`.

## Feature Notes
- **Resume Analysis**: Upload PDF/DOC/DOCX; file stored under `backend/uploads/`. Text is extracted (PDF/DOCX) and sent to Gemini with DeepSeek fallback.
- **AI Resume Generator**: Form inputs validated; generates a professional PDF with `pdfkit`.
- **Trending Jobs**: Uses API if configured, otherwise scrapes public resources; falls back to a static list.
- **Auth**: JWT for session access, Resend for OTP email, Google OAuth via Passport.
 - **Data**: Users, OTPs, resume uploads, and resume profiles are stored in MongoDB.

## Next Steps
- Persist users and resumes in MongoDB (models already included).
- Update AI prompts with real resume text extraction if desired.
