# Pathwise — Backend

> Production-oriented backend API for **Pathwise**, a full-stack Learning Management System (LMS) portfolio project built with Node.js, Express, MongoDB, and a modular feature-based architecture.

Pathwise is a **portfolio project created to demonstrate practical full-stack and backend engineering** through authentication, authorization, course management, media handling, payments, enrollment workflows, learning progress, validation, security, and automated testing.

The backend is designed around **separation of concerns, explicit business workflows, secure authentication, validation, rate limiting, centralized error handling, external service isolation, and automated testing**.

> 🚧 **Deployment:** Railway
> 🔗 **Live Application:** Coming soon

---

## 🔗 Pathwise

### Live Application

🚧 **Coming soon**

### Frontend Repository

The main user-facing Pathwise application is built separately with React.

**Frontend repository:** `Coming soon`

> The frontend repository contains the main Pathwise UI and consumes this backend API.

---

# ⚠️ Portfolio Project & Content Disclaimer

**Pathwise is a portfolio/educational software project.**

* No real courses are being sold through this project.
* No real money is involved in the payment workflow.
* Razorpay is integrated using **test-mode credentials** for demonstrating and testing the payment workflow.
* Course, enrollment, payment, and progress data are intended for demonstration and development purposes.
* This project should not be considered a real commercial learning platform.

### Video & Educational Content Disclaimer

Some video lectures used for demonstrating the learning experience may reference or use publicly available YouTube videos.

**I do not claim any ownership, authorship, copyright, trademark, or other authority over the uploaded video lectures or the educational content contained within them.**

The videos and their respective content belong entirely to their **respective YouTube channels and creators/YouTubers**.

Any such videos are used only for demonstrating the application's learning, lecture, media, and progress functionality.

All rights to third-party video content remain with their respective owners.

---

# ✨ Features

* JWT-based authentication
* Access and refresh token rotation
* HTTP-only cookie authentication
* Email verification
* Password reset
* Change password
* Email change workflow
* Instructor access request/confirmation
* Student, instructor, and admin roles
* Role-based authorization
* Account-state authorization
* Course creation and management
* Course publication workflow
* Section and lecture management
* Lecture reordering
* Image and video uploads
* Cloudinary media storage
* Student enrollment workflow
* Razorpay test-mode payment integration
* Razorpay payment verification
* Razorpay webhook handling
* Course and lecture progress tracking
* Wishlist management
* Pagination
* Filtering
* Sorting
* Searching
* Global and feature-specific rate limiting
* Centralized validation
* Centralized error handling
* Structured API responses
* Pino application logging
* Morgan HTTP request logging
* Helmet security headers
* HPP protection
* Temporary media file cleanup
* Unit testing
* API/integration testing
* Production build with esbuild

---

# 🛠️ Tech Stack

| Category            | Technology         |
| ------------------- | ------------------ |
| Runtime             | Node.js            |
| Framework           | Express 5          |
| Language            | JavaScript         |
| Module System       | ES Modules         |
| Database            | MongoDB            |
| ODM                 | Mongoose           |
| Authentication      | JWT                |
| Password Hashing    | bcryptjs           |
| Validation          | express-validator  |
| File Uploads        | Multer             |
| Media Storage       | Cloudinary         |
| Payment Gateway     | Razorpay           |
| Payment Environment | Test Mode          |
| Email Development   | Mailtrap           |
| Email Production    | Sender             |
| Logging             | Pino + Morgan      |
| Security            | Helmet + HPP       |
| Rate Limiting       | express-rate-limit |
| Testing             | Vitest + Supertest |
| Build Tool          | esbuild            |
| Formatting          | Prettier           |
| Linting             | ESLint             |
| Deployment          | Railway            |

---

# 🏗️ Architecture

Pathwise follows a **feature-based modular architecture**.

Each major business domain owns its related:

* controllers
* services
* repositories
* models
* validators
* constants
* routes

Cross-feature infrastructure such as email, media, and payment providers is separated into dedicated services.

```text id="nji7yn"
src/
│
├── config/
├── constants/
├── database/
│
├── features/
│   ├── auth/
│   ├── user/
│   ├── course/
│   ├── section/
│   ├── lecture/
│   ├── order/
│   ├── payment/
│   ├── enrollment/
│   ├── progress/
│   └── wishlist/
│
├── middlewares/
│   ├── auth/
│   ├── error/
│   ├── multer/
│   └── ratelimiter/
│
├── services/
│   ├── email/
│   ├── media/
│   └── payment/
│
├── templates/
├── utils/
├── validations/
│
└── workflow/
    └── checkout/
```

This structure keeps business domains isolated while allowing shared infrastructure to remain reusable.

---

# 🔄 Request Processing Pipeline

Pathwise uses a strict request-processing pipeline.

```text id="8y3loa"
Route
  ↓
Rate Limiter
  ↓
Authentication / Authorization
  ↓
Parameter Validation
  ↓
Multer (if required)
  ↓
Body Validation
  ↓
Validation Engine
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Database
```

Not every route requires every layer, but when applicable the ordering remains consistent.

### Route

Defines the endpoint and composes its middleware pipeline.

### Rate Limiter

Controls request frequency for global and resource-specific endpoints.

### Authentication / Authorization

Verifies the authenticated user and required role/account state.

### Validation

Validates route parameters and request body data before business logic executes.

### Multer

Handles multipart file uploads when an endpoint accepts media.

### Validation Engine

Processes validation results consistently.

### Controller

Controllers handle HTTP concerns only:

* read request data
* whitelist required fields
* call services
* construct responses

Controllers do not directly access the database or contain business rules.

### Service

Services contain business logic and are responsible for:

* business rules
* workflow decisions
* error handling
* calling repositories
* calling utilities
* coordinating external services

### Repository

Repositories contain database operations only.

---

# 🧩 Example Request Pipeline

Lecture video upload demonstrates the complete middleware chain:

```js id="c2glp5"
lectureInstructorRouter.patch(
    "/:lectureId/video",
    lectureRatelimiter.uploadLectureVideoRateLimiter,
    ...instructorAuthEngine,
    validateMongoIdParam({
        paramName: "lectureId",
        fieldName: "Lecture ID",
    }),
    videoUpload.single("video"),
    validationEngine,
    lectureControllers.uploadLectureVideo
);
```

The request flows through:

```text id="vgxtyq"
PATCH /api/v1/lectures/:lectureId/video
        ↓
Lecture rate limiter
        ↓
Instructor authentication / authorization
        ↓
MongoDB ID validation
        ↓
Multer video upload
        ↓
Validation engine
        ↓
Controller
        ↓
Service
        ↓
Repository
```

---

# 🚀 Application Bootstrap

The Express application and server startup are intentionally separated.

```text id="7vvlke"
app.js
 ├── Express application
 ├── Security middleware
 ├── Rate limiting
 ├── Request parsing
 ├── Routes
 └── Error middleware

server.js
 ├── Environment initialization
 ├── Database connection
 ├── Temporary directory initialization
 └── HTTP server startup
```

The server connects to MongoDB and ensures required upload directories exist before starting the HTTP server.

If startup fails, the error is logged as fatal and the process exits instead of starting an unhealthy application.

---

# 🔐 Authentication & Authorization

Pathwise uses JWT-based authentication with separate access and refresh tokens.

```text id="8vsm0g"
Access Token
+
Refresh Token
```

Tokens are stored in secure cookies rather than relying on client-side storage as the authentication source of truth.

The backend supports:

* access token verification
* refresh token verification
* token rotation
* cookie expiration
* token expiration
* authentication middleware
* role authorization
* account-state authorization

---

## Roles

Pathwise supports:

```text id="31kgyw"
student
instructor
admin
```

New users default to the `student` role.

Instructor access is handled through a dedicated request and confirmation workflow.

---

## Account State Protection

Some operations require more than authentication.

Pathwise provides middleware for states such as:

* active account
* verified email

This allows sensitive operations to enforce the appropriate account state before reaching business logic.

---

# 📧 Authentication Workflows

## Registration & Email Verification

```text id="r51qf8"
Register
   ↓
Create user/session
   ↓
Email verification required
   ↓
Verification email
   ↓
Verification token
   ↓
Confirm token
   ↓
Email verified
```

Verification is token-based and tokens have expiration times.

---

## Password Reset

```text id="974mt0"
Forgot password
      ↓
Generate reset token
      ↓
Send email
      ↓
Reset password
```

---

## Change Password

Changing an existing password requires the user's current password before accepting the new password.

---

## Email Change

The email change workflow uses:

```text id="fx3eo6"
Current password
+
Email change token
+
Confirmation
```

This prevents an authenticated session alone from being sufficient to change the account email.

---

## Instructor Access

Instructor access follows a confirmation workflow:

```text id="8798hm"
Student account
      ↓
Request instructor access
      ↓
Confirmation email
      ↓
Confirm token
      ↓
Instructor role
```

---

## Account Deactivation

Account deactivation uses a request and OTP confirmation workflow.

---

# 🌐 API Overview

All APIs are versioned under:

```text id="c9i1v2"
/api/v1
```

---

## Authentication APIs

```text id="jwuzck"
POST /api/v1/auth/register
POST /api/v1/auth/login

POST /api/v1/auth/email-verification
POST /api/v1/auth/email-verification/confirm/:token

POST /api/v1/auth/refresh

POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password

POST /api/v1/auth/change-password
```

---

## User APIs

```text id="4h3qu5"
GET  /api/v1/users/me

PATCH /api/v1/users/me/username

POST /api/v1/users/me/email
POST /api/v1/users/me/email/confirm/:token

POST /api/v1/users/me/instructor-access
POST /api/v1/users/me/instructor-access/confirm/:token

POST /api/v1/users/me/deactivation
POST /api/v1/users/me/deactivation/confirm
```

---

# 📚 Course Management

Course functionality supports both instructor management and public discovery.

### Instructor operations

```text id="ab6y1m"
Create course
Update course
Delete course
Update thumbnail
Save draft
Publish course
Fetch current course
Fetch all instructor courses
```

### Public operations

```text id="n93i24"
Fetch current course
Fetch all courses
```

Public course listing supports:

* pagination
* filtering
* sorting
* searching

---

# 📑 Section Management

Sections support:

```text id="boc4kc"
Create
Update
Delete
Draft
Publish
Fetch instructor section
Fetch instructor sections
Reorder
```

---

# 🎥 Lecture Management

Lectures support:

```text id="zfic2g"
Create
Update
Delete
Draft
Publish
Reorder
Upload video
Delete video
Fetch instructor lecture
Fetch instructor lectures
Fetch enrolled student lecture
```

---

# 📢 Course Publication Workflow

Publishing a course is a business workflow rather than a simple status update.

A course must satisfy the required content structure before it can be published.

```text id="clswde"
Course
  ↓
At least one published section
  ↓
Published section
  ↓
At least one published lecture
  ↓
Published lecture
  ↓
Valid video URL
+
Cloudinary public ID
+
Video duration
```

This prevents incomplete courses from becoming publicly available.

Course removal also performs the required related-content cleanup.

---

# 🖼️ Media Architecture

Pathwise does **not** use the local filesystem as permanent media storage.

Images and videos follow this lifecycle:

```text id="6u8lyf"
Client
  ↓
Express Server
  ↓
Multer
  ↓
Temporary Directory
  ↓
Cloudinary
  ↓
Cloudinary Media Information
  ↓
Temporary File Deleted
```

## Media Upload Flow

1. The client sends an image or video using `multipart/form-data`.
2. Multer stores the uploaded file in a temporary directory.
3. The media service uploads the temporary file to Cloudinary.
4. Cloudinary returns the persistent media information.
5. The application stores the required Cloudinary URL/public ID.
6. The temporary file is deleted.

Temporary files are removed **in all cases**, including when the Cloudinary upload fails.

Temporary storage is therefore only an intermediate processing layer.

```text id="gjk1bz"
temp/
├── images/
└── videos/
```

Cloudinary acts as the persistent media storage layer.

---

# 💳 Payment Architecture

Payment functionality is isolated from application features through a dedicated payment service layer.

```text id="180lns"
Feature
  ↓
Payment Service
  ↓
Payment Contract / Layer
  ↓
Razorpay Provider
```

Razorpay is configured in **test mode** for this portfolio project.

No real monetary transactions are intended to take place.

---

# 🛒 Checkout & Enrollment Workflow

Pathwise uses:

```text id="vxurc1"
Order
  ↓
Payment
  ↓
Enrollment
```

The checkout workflow coordinates these operations.

```text id="0iadbj"
Student
   ↓
Create Order
   ↓
Pending Order
   ↓
Initialize Razorpay Payment
   ↓
Razorpay Checkout
   ↓
Verify Payment
   ↓
Complete Order
   ↓
Create Enrollment
```

Orders have an expiration window of approximately **15 minutes**.

---

## Order APIs

```text id="wqhyjr"
POST  /api/v1/orders/students
PATCH /api/v1/orders/students/:orderId/cancel
```

---

## Payment APIs

The payment flow supports:

```text id="ev714j"
Payment initialization
Payment verification
Razorpay webhook handling
```

Payment verification requires:

```text id="688jbw"
razorpay_payment_id
razorpay_order_id
razorpay_signature
```

The backend verifies the Razorpay signature before considering the payment successful.

---

## Razorpay Webhook

```text id="ugx9ho"
Razorpay
   ↓
POST /api/v1/payments/webhooks/razorpay
   ↓
Raw body preservation
   ↓
Webhook signature verification
   ↓
Event processing
```

The raw request body is preserved specifically for webhook signature verification.

---

## Payment Edge Cases

The checkout implementation accounts for:

* expired orders
* duplicate enrollment attempts
* concurrent enrollment race conditions
* payment creation locking
* amount mismatch
* currency mismatch
* payment verification failures
* webhook processing

A unique student/course constraint helps protect against duplicate enrollments during concurrent requests.

---

# 🎓 Enrollment

Enrollment creation is part of the successful checkout workflow.

The backend does not expose arbitrary client-side enrollment creation as a separate public operation.

The workflow is:

```text id="a3vaxv"
Successful payment verification
        ↓
Order completion
        ↓
Enrollment creation
```

Students can retrieve their enrollments and perform supported enrollment operations through the enrollment feature.

---

# 📈 Progress Tracking

Pathwise tracks learning progress at both:

```text id="po93yo"
Course level
Lecture level
```

The progress feature supports:

```text id="79xeht"
Create/fetch course progress
Create/fetch lecture progress
Update lecture progress
Complete lecture
Complete course progress
```

---

## Lecture Progress

Lecture progress tracks information such as:

```text id="g29ps6"
lastPosition
watchedDuration
completion state
```

This allows the learning interface to resume a lecture from the student's latest position.

---

## Course Progress Metadata

The API exposes aggregate course information:

```json id="8ul2tf"
{
    "totalLectures": 0,
    "completedLectures": 0,
    "totalDuration": 0,
    "totalCompletedDuration": 0,
    "progressPercentage": 0
}
```

This allows the frontend to render course-level progress without duplicating the backend calculation.

---

# ❤️ Wishlist

The wishlist feature provides authenticated users with wishlist management functionality.

Like the other features, it follows the same:

```text id="q47so7"
Route
  ↓
Controller
  ↓
Service
  ↓
Repository
```

architecture.

---

# 📦 API Response Format

Successful responses use a consistent API response structure:

```json id="1u2gq2"
{
    "success": true,
    "statusCode": 200,
    "message": "Request successful",
    "data": {},
    "meta": {},
    "timestamp": "..."
}
```

`meta` is used for additional information such as:

* pagination
* progress statistics
* aggregate course information

---

# ❌ Error Handling

Pathwise centralizes error handling through middleware.

```text id="xq7llh"
Request
   ↓
Route
   ↓
Controller / Service
   ↓
Error
   ↓
Not Found Middleware
   ↓
Global Error Middleware
```

Application errors use structured error information including an error `code`.

This keeps error formatting consistent across the API while allowing services to define business-specific failures.

---

# 🛡️ Security

Security is implemented at multiple layers.

### HTTP Security

Pathwise uses:

* Helmet
* HPP
* CORS
* HTTP-only authentication cookies
* request body limits
* rate limiting

### Authentication Security

* JWT access tokens
* JWT refresh tokens
* token expiration
* cookie expiration
* refresh token rotation
* role authorization
* account-state authorization

### Input Security

* MongoDB ID validation
* request body validation
* centralized validation processing
* request size limits

---

# 🚦 Rate Limiting

Pathwise uses both global and feature-specific rate limiting.

```text id="rhupu0"
Global Rate Limiter
        +
Feature Rate Limiters
```

Dedicated limiters exist for areas including:

* authentication
* courses
* sections
* lectures
* orders
* payments
* enrollments
* progress
* users
* wishlist

Resource-intensive endpoints such as lecture video uploads can have dedicated limits.

---

# 📝 Logging

Pathwise uses two complementary logging systems.

## Pino

Pino provides structured application logging.

It is used for events such as:

* server startup
* fatal startup failures
* application diagnostics

## Morgan

Morgan provides HTTP request logging during development.

This gives development environments useful visibility into incoming requests without coupling request logging to application business logic.

---

# 📧 Email Service Architecture

Email functionality is isolated under:

```text id="n0zhag"
src/services/email/
```

The architecture includes:

```text id="nfkxa8"
Email Configuration
Email Provider
Email Renderer
Email Service
Mailers
Email Utilities
```

React Email is used to build structured email templates.

Development email delivery uses Mailtrap.

Production email delivery is planned around Sender.

Email templates cover workflows including:

* registration
* email verification
* password reset
* password changed
* email change
* instructor access
* account deactivation
* course enrollment

---

# ⚙️ Environment Configuration

Environment configuration is centralized in:

```text id="suorzc"
src/config/env.config.js
```

Environment variables are validated when the application starts.

Configuration is grouped into:

```text id="d1z500"
Application
Database
JWT
Email
Cloudinary
Payment
```

Required configuration includes values such as:

```text id="f910rn"
NODE_ENV
APP_NAME
PORT
CLIENT_URL

MONGO_URI
DB_NAME

JWT_ACCESS_SECRET
ACCESS_TOKEN_EXPIRY
ACCESS_TOKEN_COOKIE_EXPIRY

JWT_REFRESH_SECRET
REFRESH_TOKEN_EXPIRY
REFRESH_TOKEN_COOKIE_EXPIRY

EMAIL_LOGO_URL

MAILTRAP_API_TOKEN
MAILTRAP_SANDBOX_ID
MAILTRAP_SENDER_EMAIL
MAILTRAP_SENDER_NAME

CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

RAZORPAY_API_KEY
RAZORPAY_API_SECRET
RAZORPAY_WEBHOOK_SECRET
```

> Never commit `.env` files or production secrets to version control.

---

# 🗂️ Project Structure

```text id="3mvtoz"
pathwise-backend/
│
├── scripts/
│   └── progress.seed.js
│
├── src/
│   ├── app.js
│   ├── server.js
│   │
│   ├── config/
│   ├── constants/
│   ├── database/
│   │
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
│   │   └── wishlist/
│   │
│   ├── middlewares/
│   │   ├── auth/
│   │   ├── error/
│   │   ├── multer/
│   │   └── ratelimiter/
│   │
│   ├── services/
│   │   ├── email/
│   │   ├── media/
│   │   └── payment/
│   │
│   ├── templates/
│   │   ├── components/
│   │   ├── layouts/
│   │   └── mails/
│   │
│   ├── utils/
│   ├── validations/
│   │
│   └── workflow/
│       └── checkout/
│
├── temp/
│   ├── images/
│   └── videos/
│
├── tests/
│   ├── assertions/
│   ├── features/
│   ├── fixtures/
│   ├── helpers/
│   └── setup/
│
├── build.mjs
├── package.json
└── ...
```

Generated `dist/` output and `node_modules/` are intentionally excluded from the architecture.

---

# 🧪 Testing

The backend uses **Vitest** for testing and **Supertest** for HTTP/API testing.

Testing is separated into:

```text id="s0zbrm"
Unit Tests
API / Integration Tests
```

The test architecture includes reusable:

* fixtures
* helpers
* assertions
* API setup

Feature testing covers areas such as:

```text id="9v0jhs"
Authentication
Courses
Sections
Lectures
Users
Enrollment Workflow
Progress
```

The checkout and progress systems contain both unit-level and API-level tests.

---

## Test Commands

### Watch mode

```bash id="pba30q"
npm test
```

### Run all tests

```bash id="tt4w6c"
npm run test:run
```

### Run API tests

```bash id="mss37j"
npm run test:run-api
```

### Run unit tests

```bash id="cjmxvt"
npm run test:run-unit
```

---

# 🧹 Code Quality

## Lint

```bash id="85ikw9"
npm run lint
```

## Fix lint issues

```bash id="kskjfm"
npm run lint:fix
```

## Format

```bash id="1wzpho"
npm run format
```

## Check formatting

```bash id="8k12io"
npm run format:check
```

---

# 💻 Local Development

Install dependencies:

```bash id="m49yz4"
npm install
```

Start the development environment:

```bash id="7rnh5u"
npm run dev
```

The development command runs:

```text id="pysnw1"
esbuild watch
+
nodemon
```

This allows the backend to rebuild and restart automatically during development.

---

# 🌱 Development Seed

A progress seed script is available for development:

```bash id="b6tsla"
npm run seed:progress
```

This is useful when developing and testing learning-progress functionality.

---

# 📦 Production Build

Build the backend:

```bash id="8kjlk8"
npm run build
```

Start the production server:

```bash id="n825m5"
npm start
```

The production server runs from the generated `dist` directory.

---

# ❤️ Health Check

The backend exposes:

```text id="3b5a37"
GET /health
```

Example response:

```json id="gbap6x"
{
    "success": true,
    "message": "Server is healthy"
}
```

This can be used for basic service health checks and deployment verification.

---

# ☁️ Deployment

The current backend deployment target is **Railway**.

The planned application architecture is:

```text id="87papj"
                    ┌──────────────────┐
                    │  React Frontend  │
                    │     Vercel       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Express Backend  │
                    │     Railway      │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
          MongoDB        Cloudinary       Razorpay
                                          
                             │
                             ▼
                           Sender
```

The backend can later be migrated to infrastructure such as Hostinger or DigitalOcean without requiring a fundamental architectural rewrite.

---

# 🧠 Design Principles

## Separation of Concerns

Controllers, services, repositories, middleware, workflows, and external services have clearly defined responsibilities.

## Feature Ownership

Business domains are organized into independent feature modules.

## Explicit Workflows

Complex operations such as checkout and account verification are represented explicitly instead of being scattered across controllers.

## Validation Before Business Logic

Invalid requests are rejected before reaching service-level business operations.

## Repository-Based Data Access

Services do not directly perform database operations.

## External Service Isolation

Email, media, and payment providers are isolated under:

```text id="93orc6"
src/services/
```

## Centralized Error Handling

Errors are processed consistently through global middleware.

## Defense in Depth

Security is implemented through multiple layers rather than relying on a single mechanism.

## Testability

Business logic is separated enough to support isolated unit tests as well as API/integration tests.

## Production-Oriented Design

The project prioritizes maintainability, predictable workflows, edge-case handling, and clear boundaries between application layers.

---

# 🔭 Architecture at a Glance

```text id="0hku38"
                         CLIENT
                           │
                           ▼
                    ┌─────────────┐
                    │   Express   │
                    │ Middleware  │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Routes    │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ Controllers │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Services   │
                    └──────┬──────┘
                           │
                    ┌──────┴──────┐
                    │             │
                    ▼             ▼
             ┌────────────┐  ┌──────────────┐
             │ Repository │  │ External     │
             │            │  │ Services     │
             └─────┬──────┘  └──────────────┘
                   │
                   ▼
              ┌──────────┐
              │ MongoDB  │
              └──────────┘
```

External integrations remain isolated:

```text id="q2cyll"
Email
  → Email Service
  → Email Provider

Media
  → Media Service
  → Cloudinary

Payment
  → Payment Service
  → Razorpay
```

---

# 🎯 Why This Architecture?

Pathwise is structured to demonstrate backend engineering beyond basic CRUD implementation.

The architecture emphasizes:

* clear request pipelines
* modular feature boundaries
* isolated business logic
* reusable infrastructure
* explicit workflows
* secure authentication
* role and account-state authorization
* external service abstraction
* payment verification
* media lifecycle management
* edge-case handling
* centralized errors
* automated testing
* production-oriented configuration

The goal is to keep the codebase maintainable as additional LMS functionality is introduced.

---

# 🔭 Future Improvements

Potential future improvements include:

* Production deployment and monitoring
* Expanded administrative functionality
* Broader automated test coverage
* Background processing for suitable asynchronous operations
* Expanded observability
* Additional provider flexibility
* Infrastructure migration options such as DigitalOcean or Hostinger

---

# 👨‍💻 Author

**Krut Aghera**

Pathwise is a **full-stack portfolio project** created to demonstrate practical frontend and backend engineering through:

* REST API architecture
* authentication
* authorization
* payment workflows
* media processing
* email workflows
* database architecture
* automated testing
* security
* production-oriented application design

---

## 📄 License

This project is licensed under the **ISC License**.
