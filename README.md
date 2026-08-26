````md
---
# OUTBOX — Full-Stack Email Job Scheduler

A production-oriented email scheduling application built for the **ReachInbox / Outbox Labs Software Development Intern Assignment**.

Users can authenticate with Google, create email campaigns, upload recipient lists, schedule emails, and monitor scheduled and sent emails.

The application uses **Next.js, Express.js, PostgreSQL, Prisma, Redis, BullMQ, Nodemailer, and Ethereal SMTP**.

---

## Features

### Authentication

- Google OAuth 2.0
- Session-based authentication
- User profile and Google avatar
- Protected dashboard routes
- Logout

### Campaign Management

- Create email campaigns
- Subject and email body
- Upload CSV/TXT recipient lists
- Email validation
- Duplicate email removal
- Configure campaign start time
- Configure delay between emails
- Campaign cancellation

### Email Scheduling

- BullMQ delayed jobs
- Redis-backed job persistence
- Configurable delay between emails
- No cron jobs
- Jobs survive backend/worker restarts

### Email Processing

- Background BullMQ worker
- Nodemailer
- Ethereal SMTP for test email delivery
- Configurable worker concurrency
- Email status tracking
- Sent timestamp tracking
- Failed email tracking
- Retry handling
- Idempotent email processing

### Rate Limiting

- Redis-backed hourly rate limiting
- Per-user email limits
- Atomic Redis counters
- Configurable hourly limit
- Rate-limited jobs are rescheduled instead of discarded

### Dashboard

- Scheduled emails
- Sent emails
- Search
- Refresh
- Email status
- Scheduled timestamp
- Sent timestamp
- Email details
- User profile

---

# Architecture

```text
                         ┌────────────────────┐
                         │      Next.js       │
                         │     Frontend       │
                         └─────────┬──────────┘
                                   │
                              HTTP / API
                                   │
                                   ▼
                         ┌────────────────────┐
                         │   Express.js API   │
                         │      Backend       │
                         └───────┬─────┬──────┘
                                 │     │
                    ┌────────────┘     └─────────────┐
                    ▼                                ▼
           ┌─────────────────┐              ┌─────────────────┐
           │   PostgreSQL    │              │      Redis      │
           │     Prisma      │              │     BullMQ      │
           └─────────────────┘              └────────┬────────┘
                                                      │
                                                      │ Jobs
                                                      ▼
                                             ┌─────────────────┐
                                             │  Email Worker   │
                                             │     BullMQ      │
                                             └────────┬────────┘
                                                      │
                                                      ▼
                                             ┌─────────────────┐
                                             │  Ethereal SMTP  │
                                             └─────────────────┘
````

---

# Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

## Backend

* Node.js
* Express.js
* TypeScript
* Prisma
* PostgreSQL

## Queue & Background Processing

* Redis
* BullMQ
* ioredis

## Email

* Nodemailer
* Ethereal SMTP

## Authentication

* Passport.js
* Google OAuth 2.0
* express-session

---

# Project Structure

```text
email-scheduler/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── queue/
│   │   ├── server.ts
│   │   ├── worker.ts
│   │   └── ...
│   │
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── types/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

# How Scheduling Works

When a campaign is created:

1. The frontend sends the campaign data to the backend.
2. The backend validates the recipients.
3. The campaign and email records are stored in PostgreSQL.
4. BullMQ jobs are created for the emails.
5. Each job receives a calculated delay based on:

   * Campaign start time
   * Email position
   * Delay between emails
6. Redis stores the BullMQ jobs.
7. When a job becomes available, the worker processes it.
8. The worker checks the email status in PostgreSQL.
9. The worker checks the Redis rate limit.
10. If sending is allowed, Nodemailer sends the email through Ethereal SMTP.
11. PostgreSQL is updated with the result.

Example:

```text
Start: 11:00 PM
Delay: 60 seconds

Email 1 → 11:00 PM
Email 2 → 11:01 PM
Email 3 → 11:02 PM
Email 4 → 11:03 PM
```

No cron job or `setInterval` scheduler is required.

---

# Background Worker

The API server and email worker are separate processes.

### API Server

```bash
npm run dev
```

Responsible for:

* Authentication
* Campaign APIs
* Email APIs
* Database operations
* Creating BullMQ jobs

### Worker

```bash
npm run worker
```

Responsible for:

* Reading BullMQ jobs
* Checking rate limits
* Sending emails
* Updating email status
* Retrying failed jobs

In production, the worker should run as a **separate background worker service** from the API web service.

```text
Render Web Service
        │
        └── Express API

Render Background Worker
        │
        └── BullMQ Worker
                │
                ├── Redis
                ├── PostgreSQL
                └── Ethereal SMTP
```

The worker does not open an HTTP port, so it should not be deployed as a web service that expects a listening port.

---

# Rate Limiting

The application uses Redis to maintain a per-user hourly email counter.

The logical key is:

```text
email-rate-limit:<userId>:<hourWindow>
```

Example:

```text
email-rate-limit:user-id:496578
```

If the limit is:

```text
MAX_EMAILS_PER_HOUR=2
```

and four emails become available:

```text
Email A → sent
Email B → sent
Email C → rate limit reached
Email D → rate limit reached
```

Emails C and D are not deleted.

They are rescheduled for the next available sending window.

```text
                 Email Job
                     │
                     ▼
              Redis Rate Limit
                     │
             ┌───────┴───────┐
             │               │
          Allowed        Limit Reached
             │               │
             ▼               ▼
            Send        Reschedule Job
             │               │
             ▼               ▼
          Mark Sent     Future Job
```

---

# Worker Concurrency

Worker concurrency is configurable through an environment variable.

Example:

```env
WORKER_CONCURRENCY=5
```

This allows the worker to process multiple available jobs concurrently while Redis controls the hourly sending limit.

Concurrency and rate limiting solve different problems:

* **Concurrency** controls how many jobs can be processed at once.
* **Rate limiting** controls how many emails a user can send during an hourly window.

---

# Idempotency

Before sending an email, the worker checks its database status.

```text
scheduled
    │
    ▼
Worker receives job
    │
    ▼
Check PostgreSQL
    │
    ├── sent → stop
    │
    └── scheduled → continue
                         │
                         ▼
                       Send
                         │
                         ▼
                    Mark as sent
```

This prevents an already-completed email from being sent again if the same job is processed more than once.

---

# Persistence

The application uses PostgreSQL and Redis for durable state.

```text
PostgreSQL
    │
    ├── Users
    ├── Campaigns
    └── Emails

Redis
    │
    ├── BullMQ jobs
    └── Rate-limit counters
```

A future scheduled job is not kept only in Node.js memory.

If the API or worker restarts, the application reconnects to Redis and continues processing the remaining BullMQ jobs.

---

# Email Delivery

Emails are sent using:

```text
BullMQ Worker
      │
      ▼
Nodemailer
      │
      ▼
Ethereal SMTP
```

Ethereal is used for testing and demonstration purposes.

It does not represent real production email delivery.

---

# Environment Variables

Create a `.env` file inside `backend/`.

```env
DATABASE_URL="your-postgresql-connection-string"

REDIS_URL="your-redis-connection-string"

PORT=5000

NODE_ENV="development"

SESSION_SECRET="your-session-secret"

FRONTEND_URL="http://localhost:3000"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"

SMTP_HOST="smtp.ethereal.email"
SMTP_PORT=587
SMTP_USER="your-ethereal-username"
SMTP_PASS="your-ethereal-password"

WORKER_CONCURRENCY=5
MAX_EMAILS_PER_HOUR=2
```

Never commit real environment variables or credentials to GitHub.

---

# Local Development

## 1. Clone the repository

```bash
git clone <repository-url>
cd email-scheduler
```

## 2. Install backend dependencies

```bash
cd backend
npm install
```

## 3. Configure environment variables

Create:

```text
backend/.env
```

and add the required variables.

## 4. Generate Prisma Client

```bash
npx prisma generate
```

## 5. Run database migrations

```bash
npx prisma migrate dev
```

## 6. Start the backend

```bash
npm run dev
```

## 7. Start the worker

Open another terminal:

```bash
cd backend
npm run worker
```

## 8. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on:

```text
http://localhost:3000
```

---

# Production Deployment

The application requires three external services:

```text
Frontend
    │
    ▼
Vercel

Backend API
    │
    ▼
Render Web Service

Background Worker
    │
    ▼
Render Background Worker
```

Both the API service and worker use the same:

* PostgreSQL database
* Redis instance
* Environment variables

### Render API Service

Build command:

```bash
npm install && npx prisma generate && npm run build
```

Start command:

```bash
npm start
```

### Render Worker

Build command:

```bash
npm install && npx prisma generate && npm run build
```

Start command:

```bash
npm run worker
```

The worker should be configured as a **Background Worker**, not a Web Service, because it does not listen on an HTTP port.

---

# API Endpoints

## Authentication

```text
GET  /api/auth/google
GET  /api/auth/google/callback
GET  /api/auth/me
POST /api/auth/logout
```

## Campaigns

```text
POST   /api/campaigns
GET    /api/campaigns
GET    /api/campaigns/:id
DELETE /api/campaigns/:id
```

## Emails

The exact email endpoints depend on the current backend route implementation.

Typical operations include:

```text
POST /api/emails
GET  /api/emails
GET  /api/emails/scheduled
GET  /api/emails/sent
```

---

# Database Model

The main entities are:

```text
User
 │
 └── EmailCampaign
        │
        └── Email
```

An email contains information such as:

```text
id
campaignId
recipient
subject
body
status
scheduledAt
sentAt
attempts
errorMessage
```

Possible statuses include:

```text
scheduled
processing
sent
failed
cancelled
```

---

# CSV/TXT Recipient Upload

The application supports recipient lists through CSV/TXT files.

The upload process:

```text
Upload File
     │
     ▼
Extract Email Addresses
     │
     ▼
Validate Emails
     │
     ▼
Remove Duplicates
     │
     ▼
Display Recipient Count
     │
     ▼
Create Campaign
```

Invalid email addresses are rejected before scheduling.

---

# Campaign Cancellation

A scheduled campaign can be cancelled.

Cancellation updates the campaign/email state and prevents pending scheduled emails from being processed.

---

# Testing Scheduler Behavior

Important scenarios to test before submission:

### 1. Immediate scheduling

```text
Create campaign
Start time = current/future time
Delay = configured value
```

Verify that emails are processed in the expected order.

### 2. Delayed scheduling

```text
Create campaign
Start time = future time
```

Verify that the worker does not send the email before the scheduled time.

### 3. Rate limiting

```text
MAX_EMAILS_PER_HOUR=2
```

Schedule more than two emails.

Expected:

```text
First 2 → sent
Remaining → retained/rescheduled
```

### 4. Worker restart

```text
1. Schedule a future email
2. Stop the worker
3. Start the worker again
4. Wait for the scheduled time
5. Verify the email is processed
```

### 5. Idempotency

Verify that an email already marked as `sent` is not sent again.

### 6. Failed email

Simulate an SMTP failure and verify that the job follows the configured retry behavior.

---

# Assignment Requirements

| Requirement                | Status |
| -------------------------- | ------ |
| TypeScript backend         | ✅      |
| Express.js                 | ✅      |
| PostgreSQL                 | ✅      |
| Prisma                     | ✅      |
| Redis                      | ✅      |
| BullMQ                     | ✅      |
| Delayed jobs               | ✅      |
| No cron                    | ✅      |
| Ethereal SMTP              | ✅      |
| Nodemailer                 | ✅      |
| Worker concurrency         | ✅      |
| Configurable email delay   | ✅      |
| Hourly rate limiting       | ✅      |
| Redis-backed rate limiting | ✅      |
| Rate-limit rescheduling    | ✅      |
| Idempotent worker          | ✅      |
| Google OAuth               | ✅      |
| CSV/TXT upload             | ✅      |
| Email validation           | ✅      |
| Duplicate removal          | ✅      |
| Scheduled dashboard        | ✅      |
| Sent dashboard             | ✅      |
| Search                     | ✅      |
| Refresh                    | ✅      |
| Loading states             | ✅      |
| Empty states               | ✅      |
| Campaign cancellation      | ✅      |
| Persistent scheduled jobs  | ✅      |
| Restart persistence        | ✅      |
| Demo video                 | ✅    |
| Private GitHub repository  | ✅      |


---

# Important Production Notes

### API and Worker are separate processes

Do not run:

```bash
npm start
```

and expect the BullMQ worker to process emails automatically.

The production setup should be:

```text
                    Redis
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
   Render Web Service      Render Background Worker
          │                       │
     npm start              npm run worker
          │                       │
          ▼                       ▼
      Express API             BullMQ Worker
```

### SMTP availability

Email delivery depends on Ethereal SMTP being reachable from the worker.

If SMTP connection verification fails, the worker should not silently claim that emails were sent.

### Redis availability

BullMQ and the rate limiter depend on Redis. Redis must remain available for scheduled jobs to be processed.

---

# Demo Flow

The recommended demonstration sequence is:

1. Open the deployed application.
2. Login with Google.
3. Open the dashboard.
4. Create a campaign.
5. Upload a recipient list.
6. Configure subject and body.
7. Configure start time.
8. Configure delay between emails.
9. Schedule the campaign.
10. Verify scheduled emails appear in the dashboard.
11. Let the BullMQ worker process the jobs.
12. Open Ethereal and verify the test emails.
13. Verify emails appear as `sent`.
14. Demonstrate the hourly rate limit.
15. Demonstrate that rate-limited jobs remain scheduled/rescheduled.
16. Stop and restart the worker.
17. Verify future jobs continue processing.

---

## Project Links

- **GitHub:** [tsujit74/email-scheduler](https://github.com/tsujit74/email-scheduler)
- **Frontend:** [Live Application](https://email-scheduler-seven-beta.vercel.app)
- **Backend API:** [Backend API](https://email-scheduler-lpr1.onrender.com)
- **Author:** Sujit Thakur
