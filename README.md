# Pathwise — Backend

A full-stack Learning Management System (LMS) built with the MERN stack, designed to explore backend architecture, authentication, course management, payment workflows, data integrity, and external service integrations.

Developed from the ground up over two months, Pathwise demonstrates the practical application of full-stack engineering principles through interconnected features, structured business logic, automated testing, and production deployment.

---

## 🚢 Deployment

Pathwise uses a separate frontend and backend deployment architecture.

- **Frontend:** Vercel
- **Backend:** Veeble Ubuntu VPS
- **Reverse Proxy:** Nginx
- **Process Management:** PM2
- **Database:** MongoDB Atlas

The React frontend communicates with the versioned Express REST API, while the backend runs on a self-managed Ubuntu server. Cloudflare manages DNS, and Cloudinary handles media storage.

---

## 🌐 Live Site

🔗 **Live Website:** [https://pathwiseeducation.in](https://pathwiseeducation.in/)

---

---

🔗 **Frontend Repository:** [pathwise-frontend](https://github.com/Krut-Aghera/pathwise-frontend)

---

## 📖 Overview

Pathwise is a feature-rich LMS that supports student enrollment, instructor course management, lecture delivery, learning progress tracking, and administrative operations.

The backend follows a **modular, feature-based architecture** that separates HTTP request handling, business logic, database operations, and external service integrations.

Rather than treating each endpoint as an isolated CRUD operation, the application coordinates multi-step workflows such as account verification, course publication, checkout, payment verification, and enrollment. These workflows incorporate business rules, validation, and safeguards for sensitive operations.

---

## ✨ Features

### Authentication & Authorization

- JWT-based authentication with access and refresh tokens.
- HTTP-only cookie-based session management.
- Refresh token rotation.
- Email verification, password reset, and password change workflows.
- Secure email change and instructor access confirmation.
- Role-based authorization for students, instructors, and administrators.
- Account-state validation and account deactivation workflows.

### Course & Learning Management

- Course creation, updating, deletion, and publication.
- Section and lecture management with reordering.
- Course publication validation based on content requirements.
- Image and video uploads through Cloudinary.
- Student enrollment and access management.
- Lecture-level and course-level learning progress tracking.

### Order & Payment Workflows

- Razorpay payment gateway integration in test mode.
- Payment initialization and signature verification.
- Webhook signature verification and event processing.
- Order lifecycle management and expiration handling.
- Checkout workflows coordinating orders, payments, and enrollment.
- Handling of payment failures, duplicate enrollment attempts, and workflow edge cases.

### Administrative Operations

- Dedicated administrator dashboard.
- Administrative access protected by role-based authorization.
- Aggregated dashboard data retrieval.
- Centralized management of administrative functionality.

### Security & Reliability

- Global and feature-specific rate limiting.
- Request validation using express-validator.
- Security headers with Helmet.
- HTTP parameter pollution protection using HPP.
- Centralized error handling and consistent API responses.
- Structured logging with Pino and HTTP request logging with Morgan.
- Temporary file cleanup after media upload processing.
- Automated unit and API/integration tests.

### API Capabilities

- Versioned REST API under `/api/v1`.
- Pagination, filtering, sorting, and searching.
- Centralized environment configuration and validation.
- Consistent response structures and application error codes.
- Production build process using esbuild.

---

## 🛠️ Tech Stack

### Backend

- Node.js
- Express.js
- JavaScript (ES Modules)
- MongoDB Atlas
- Mongoose

### Authentication & Security

- JSON Web Tokens (JWT)
- bcryptjs
- HTTP-only cookies
- express-validator
- express-rate-limit
- Helmet
- HPP

### External Services

- **Cloudinary:** Image and video storage.
- **Mailtrap / Sender:** Email delivery integrations.
- **Razorpay:** Payment gateway integration in test mode.

### Logging & Testing

- Pino
- Morgan
- Vitest
- Supertest

### Build & Deployment

- esbuild
- PM2
- Nginx
- Ubuntu VPS
- Cloudflare

### Frontend Integration

- React
- Axios
- Redux Toolkit Query

---

## 🏗️ Architecture

The backend follows a **modular, feature-based architecture** with clear separation of responsibilities.

### Request Lifecycle

```text
Client Request
      |
      v
    Routes
      |
      v
  Middleware
      |
      v
   Validation
      |
      v
  Controllers
      |
      v
    Services
      |
      v
  Repositories
      |
      v
    MongoDB
```

Middleware and validation are composed according to each endpoint's requirements.

- **Routes:** Define API endpoints and compose the required middleware.
- **Middleware:** Handle authentication, authorization, rate limiting, and file uploads.
- **Controllers:** Manage HTTP requests and responses.
- **Services:** Implement business logic, enforce application rules, and coordinate workflows.
- **Repositories:** Encapsulate database operations.
- **Integration Services:** Isolate email delivery, media storage, and payment processing.

### Feature Modules

- **Auth:** Authentication, token management, and account verification.
- **User:** Profile management, account operations, and instructor access.
- **Course:** Course creation, discovery, and publication.
- **Section:** Section management and ordering.
- **Lecture:** Lecture management, media uploads, and publication.
- **Order:** Order creation, lifecycle management, and cancellation.
- **Payment:** Payment initialization, verification, and webhook handling.
- **Enrollment:** Student enrollment workflows.
- **Progress:** Lecture and course progress tracking.
- **Dashboard:** Administrative dashboard functionality.

### Project Structure

```text
pathwise-backend/
├── scripts/
│   └── progress.seed.js
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── constants/
│   ├── database/
│   ├── features/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── course/
│   │   ├── section/
│   │   ├── lecture/
│   │   ├── order/
│   │   ├── payment/
│   │   ├── enrollment/
│   │   ├── progress/
│   │   └── dashboard/
│   ├── middlewares/
│   │   ├── auth/
│   │   ├── error/
│   │   ├── multer/
│   │   └── ratelimiter/
│   ├── services/
│   │   ├── email/
│   │   ├── media/
│   │   └── payment/
│   ├── templates/
│   │   ├── components/
│   │   ├── layouts/
│   │   └── mails/
│   ├── utils/
│   ├── validations/
│   └── workflow/
│       └── checkout/
├── temp/
│   ├── images/
│   └── videos/
├── tests/
│   ├── assertions/
│   ├── features/
│   ├── fixtures/
│   ├── helpers/
│   └── setup/
├── build.mjs
└── package.json
```

---

## 🔑 Key Engineering Implementations

- **Separation of concerns:** Dedicated controllers, services, repositories, and middleware with distinct responsibilities.
- **Workflow-oriented business logic:** Coordinated checkout, payment verification, enrollment, and account verification workflows.
- **Token lifecycle management:** Access and refresh tokens with rotation and HTTP-only cookie authentication.
- **Business-rule enforcement:** Course publication requirements and safeguards around enrollment and payment operations.
- **Webhook processing:** Signature verification and payment event handling.
- **Centralized API responses:** Consistent response structures, error handling, and application error codes.
- **External service isolation:** Dedicated integrations for payment processing, email delivery, and media storage.
- **Automated testing:** Unit and API/integration tests using Vitest and Supertest.
- **Production deployment:** Optimized builds, environment configuration, PM2 process management, and Nginx reverse proxy configuration.

---

## 🚀 Getting Started

### Prerequisites

Ensure the following are available:

- Node.js and npm.
- A MongoDB Atlas database.
- Cloudinary credentials.
- Email provider credentials.
- Razorpay test-mode credentials.


## 🌍 Deployment Architecture

Pathwise separates frontend hosting, backend execution, database management, and external integrations.

| Component | Technology |
|---|---|
| Frontend Hosting | Vercel |
| Backend Hosting | Veeble Ubuntu VPS |
| Reverse Proxy | Nginx |
| Process Management | PM2 |
| Database | MongoDB Atlas |
| DNS Management | Cloudflare |
| Media Storage | Cloudinary |
| Email Delivery | Sender |
| Payment Integration | Razorpay Test Mode |

The backend is deployed on an Ubuntu VPS behind Nginx, with PM2 managing the Node.js process. MongoDB Atlas provides database hosting, while Cloudinary and external email and payment services handle their respective integrations.

---

## 👨‍💻 Author

**Krut Aghera**

BCA, Amity University Online — 2026

GitHub: [Krut-Aghera](https://github.com/Krut-Aghera)

Pathwise represents an important step in my software engineering journey: applying full-stack fundamentals to independently design, implement, test, and deploy a structured application with interconnected features, business workflows, and backend infrastructure.
