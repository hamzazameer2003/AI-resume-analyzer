# Features and Functions

## Core Flow
- User uploads a PDF or Word resume and provides the target job/post.
- Resume is analyzed using a free AI tool (e.g., Gemini or DeepSeek).
- Show analysis results: pros, cons, suggestions, and an ATS score.
- Uploaded resume file is saved in the database.
- Based on the resume, show career suggestions.

## Dashboard
- A user dashboard shows resume scores and detailed analysis for each uploaded resume.

## Authentication
- Signup with name, email, password, confirm password.
- After signup, user must verify OTP sent to email.
- Login to access the site.
- All features require authentication (no access without login).

## Landing Page
- Create a nice landing page with necessary details and sections.
## AI Resume Generator
- Provide a form for user input to generate a downloadable resume using AI.
- Store form inputs in the database.
- Generate a professional-format PDF resume from stored inputs.
- Validate that all required fields are filled.
- Ask whether the user is experienced or a fresher:
- If experienced, collect experience details.
- If fresher, collect projects and short descriptions.
- If user-provided details exceed required length, rephrase them with AI before generating the PDF.
## Trending Jobs
- Show top trending jobs by checking the internet in real time.
- Provide a short detail for each trending job.
- Identify companies working in those fields.
- Surface available opportunities related to those jobs/companies.
## Social Login
- Add "Login with Google" option.

## UI/Backend Structure
- Each feature should have a separate screen in the UI.
- Each feature should have separate files and functions in the backend for clarity.
