# TaskFlow - Task Management System

**Live Demo:** [https://task-management-system-production-2bf8.up.railway.app/](https://task-management-system-production-2bf8.up.railway.app/)

Hey there! This is my submission for the Task Tracker Web App mini-project. 

I built this as a lightweight, full-stack task management system where users can create tasks, track their progress, and get a quick bird's-eye view of their productivity through a dashboard.

##  Tech Stack

I stuck strictly to the assignment constraints:
- **Frontend:** React (bootstrapped with Vite) + vanilla CSS
- **Backend:** Node.js & Express
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT stored securely in `httpOnly` cookies

##  Design Decisions

Here are a few technical choices I made while building this:

1. **Security First (Cookies over LocalStorage):** Instead of storing the JWT in the browser's `localStorage` (which is vulnerable to XSS attacks), the backend sets it as an `httpOnly` cookie. This means the browser automatically handles sending the token back and forth, keeping it safe from malicious scripts.
2. **Zero Charting Libraries:** To keep the frontend bundle as small and fast as possible, I didn't install Recharts or Chart.js for the analytics section. Instead, I built the Donut and Bar charts completely from scratch using basic SVG and CSS. 
3. **Database Indexing:** I added compound indexes to the MongoDB `Task` model (e.g., `owner + status` and `owner + priority`). This ensures that even if a user has thousands of tasks, filtering them on the dashboard remains lightning fast.
4. **Custom Error Handling:** I wrote a global error-handling middleware for the Express backend so that the API never crashes silently. It always returns a predictable, clean JSON error message to the frontend.
5. **No Utility CSS Frameworks:** I wrote around ~400 lines of custom vanilla CSS rather than relying on heavy frameworks like Tailwind or Bootstrap, keeping the UI clean and simple.

##  How to Run Locally

You'll need Node.js and MongoDB installed on your machine.

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` folder: `cd backend`
2. Install dependencies: `npm install`
3. Rename the `.env.example` file to `.env` (it defaults to port 5000 and standard local MongoDB).
4. Start the server: `npm run dev`

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder: `cd frontend`
2. Install dependencies: `npm install`
3. Rename the `.env.example` file to `.env` (it points the API to `http://localhost:5000/api`).
4. Start the Vite dev server: `npm run dev`
5. Open your browser to `http://localhost:5173`

##  API Endpoints Reference

### Auth
- `POST /api/auth/register` - Create a new account
- `POST /api/auth/login` - Login and receive cookie
- `POST /api/auth/logout` - Clear the auth cookie
- `GET /api/auth/me` - Get the currently logged-in user profile

### Tasks
- `GET /api/tasks` - Get tasks (Supports query params: `?status=done`, `?priority=high`, `?search=term`, `?page=1&limit=10`, `?sortBy=dueDate`)
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update a task
- `PATCH /api/tasks/:id/status` - Quick-toggle a task's status
- `DELETE /api/tasks/:id` - Delete a task

### Analytics
- `GET /api/analytics/summary` - Get total, pending, done, and completion rate
- `GET /api/analytics/trend` - Get task creation trends over the last 7 days
