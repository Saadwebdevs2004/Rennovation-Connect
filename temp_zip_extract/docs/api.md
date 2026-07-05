# 🔌 REST API Documentation - Renovation Connect

This document outlines the API endpoints, methods, parameters, and payloads available on the backend server (`http://localhost:3001`).

---

## 🔐 1. Authentication (`/backend/routes/auth.js`)

### POST `/api/register`
Creates a new user account.
- **Request Body**:
  ```json
  {
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "userRole": "homeowner"
  }
  ```
- **Response Codes**:
  - `201 Created`: User registered successfully.
  - `400 Bad Request`: Missing required fields.
  - `409 Conflict`: Email already in use.

### POST `/api/login`
Authenticates a user.
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response Codes**:
  - `200 OK`: Login successful (returns User ID, FullName, and Role).
  - `401 Unauthorized`: Invalid credentials.

---

## 🛠️ 2. Jobs Management (`/backend/server.js`)

### POST `/api/jobs`
Allows homeowners to post a new job.
- **Request Body**:
  ```json
  {
    "homeownerId": 1,
    "title": "Kitchen Cabinet Refitting",
    "category": "Carpentry",
    "description": "Needs standard premium finishing",
    "location": "New York",
    "budgetMin": 500,
    "budgetMax": 1200,
    "urgency": "Urgent"
  }
  ```

### GET `/api/jobs`
Fetches open jobs.
- **Query Params**:
  - `workerId` (optional): Highlights jobs that this worker has already bidded on.

### GET `/api/jobs/homeowner/:id`
Lists all jobs posted by a specific homeowner.

### PUT `/api/jobs/:id/status`
Updates job status (`open`, `assigned`, `completed`, `disputed`).

---

## 🤝 3. Bids & Proposals (`/backend/routes/bids.js`)

### POST `/api/bids`
Allows workers to place bids on open jobs.
- **Request Body**:
  ```json
  {
    "job_id": 4,
    "worker_id": 2,
    "amount": 950.00,
    "proposal_text": "I can finish this in 3 days using high quality wood."
  }
  ```

### PUT `/api/bids/:id/accept`
Accepts a bid and automatically marks other bids on the same job as rejected.

---

## 💬 4. Messaging & Notifications

### POST `/api/messages`
Sends a direct message.
- **Request Body**:
  ```json
  {
    "sender_id": 1,
    "receiver_id": 2,
    "job_id": 4,
    "content": "Hi, when can you start?"
  }
  ```

### GET `/api/messages/:userId1/:userId2`
Fetches full chat history between two users.

### GET `/api/notifications/:userId`
Fetches notifications for a specific user.
