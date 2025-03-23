# 🌈 r-ainbow_phi

A scalable, secure, and event-driven NestJS backend application implementing:

- 🔐 JWT-based Authentication
- 🎂 Birthday Discount Campaign with Cron & BullMQ
- 📦 Product Recommendations
- 📧 Email Notifications via Nodemailer & Handlebars
- 🧪 Testing with Jest
- 🧼 Git Hooks (ESLint, Prettier, Type Check, CommitLint) via Husky

## 📜 Use Case

This project implements a scalable and secure solution to run a Birthday Discount Campaign. Customers receive personalized emails with discount codes and suggested products a week before their birthday. Additionally, personalized product recommendations appear in-app around their birthday.

## 📚 Table of Contents

- [🧰 Tech Stack](#-tech-stack)
- [🔸 Key Architectural Patterns](#-key-architectural-patterns)
- [🛠️ Detailed Module and Feature Breakdown](#-detailed-module-and-feature-breakdown)
- [📦 Features](#-features)
- [🔸 Prerequisites](#-prerequisites)
- [🚀 Getting Started](#-getting-started)
- [📈 Code Quality & Implementation Best Practices](#-code-quality--implementation-best-practices)
- [📖 Immediate Future Enhancements](#-immediate-future-enhancements)
- [📐 System Flow](#-system-flow)
- [🗃️ Architecture Overview](#-architecture-overview)
- [📨 Birthday Campaign Flow](#-birthday-campaign-flow)
- [🔐 Auth Flow](#-auth-flow)
- [⚙️ Configuration](#-configuration)
- [✅ Git Hooks](#-git-hooks)
- [🧪 Testing](#-testing)
- [📦 Docker Setup](#-docker-setup)
- [🧑‍💻 Contribution Guide](#-contribution-guide)

## 🧰 Tech Stack

| Layer       | Stack                                      |
| ----------- | ------------------------------------------ |
| Framework   | [NestJS](https://nestjs.com/) (TypeScript) |
| ORM         | TypeORM                                    |
| DB          | PostgreSQL                                 |
| Queue       | BullMQ + Redis                             |
| Mail        | Nodemailer + Handlebars                    |
| Auth        | Passport (Local + JWT)                     |
| Scheduler   | @nestjs/schedule                           |
| Validation  | Class-validator + Joi                      |
| Dev Tooling | ESLint, Prettier, Husky, CommitLint        |
| Testing     | Jest, Supertest                            |
| Docs        | Swagger via @nestjs/swagger                |

## 🔸 Key Architectural Patterns:

-     **Modular (Feature-based):**
  Organised into Auth, Campaign, Customers, Products, Jobs, Seeds, and Mail modules.
-     **Event-Driven & Asynchronous Processing:**
  Leveraging BullMQ for reliable job scheduling and execution.
-     **Service-oriented Design:**
  Clearly separated services for email sending, customer management, and product recommendations.
-     **Security by Design:**
  JWT authentication with Passport.js, validation modules, and security best practices.
-     **Configuration Management:**
  Centralized via configuration modules (src/config), easing environment management.

## 🛠️ Detailed Module and Feature Breakdown

### Auth Module (src/modules/auth):

#### Purpose

Handles user authentication, registration, and secure route management.

#### Main Components

- Controllers (auth.controller.ts)
- Services (auth.service.ts)
- Strategies & Guards (JWT, Local)
- DTOs for structured data validation (login.dto.ts, register.dto.ts)

### Campaign Module (src/modules/campaign)

#### Purpose

Orchestrates the business logic for the birthday discount campaign.

#### Main Components

- campaign.service.ts: Core logic for triggering personalized birthday campaigns.
- campaign.controller.ts: Endpoints to manually trigger or monitor campaigns.

### Customers Module (src/modules/customers):

#### Purpose

Manages customer profiles and relevant CRUD operations.

#### Main Components

- Customer Entity (customer.entity.ts)
- DTOs for clean data handling (create-customer.dto.ts, update-customer.dto.ts)

### Products Module (src/modules/products)

#### Purpose

Manages product listings and recommendation logic.

#### Main Components

- Product Entity (product.entity.ts)
- products.service.ts: Implements recommendation logic.

### Mail Module (src/modules/mail)

#### Purpose

Handles email sending using nodemailer and Handlebars templating.

#### Main Components

- Email Service (mail.service.ts)
- Templates: Handlebars (birthday.hbs)

### Jobs Module (src/modules/jobs)

#### Purpose

Manages periodic scheduling and execution of campaign jobs.

#### Main Components

- Scheduler (birthday.scheduler.ts): triggers jobs weekly.
- Job Processor (jobs.processor.ts): handles actual sending of emails.

### Seeds Module (src/modules/seeds)

#### Purpose

Handles initiating initial data.

#### Main Components

- Seed Service (seeds.service.ts)

## 📦 Features

- User Registration & Login (Local + JWT)
- Secure Auth with Hashed Passwords
- Daily Cron Job for Birthday Campaign
- Suggested Product Recommendations
- Queued Email Delivery with BullMQ & Redis
- Swagger API Documentation
- Git Hooks: Lint, Format, Test, Commit Validation

## 🔸 Prerequisites

1. [ ] Node.js v22+
2. [ ] Yarn
3. [ ] Docker (for PostgreSQL and BullMQ Redis)

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/mfmsajidh/r-ainbow_phi
cd r-ainbow_phi
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Setup environment

Copy `.env.example` to `.env.<environment>` and fill out your credentials

### 4. Start Dependencies (Postgres, Redis)

- [🐳 Docker Setup](#-docker-setup)

### 5. Seed

Set `RUN_SEED` environment variable to `true` only during INITIAL RUN

### 6. Start the application

```bash
yarn start:dev
```

### 7. Access API Documentation (Swagger UI)

Visit [http://localhost:\<PORT>/v1/<SWAGGER_URL>](http://localhost:<PORT>/v1/<SWAGGER_URL>)

## 📈 Code Quality & Implementation Best Practices

### Clean Coding & Maintainability:

- Clear modularization following NestJS best practices.
- Strong use of TypeORM ensures data integrity.
- DTOs and entities ensure clear data flows and consistency.

### Security Best Practices:

- JWT & Passport.js integration secures APIs.
- Validation and sanitization via class-validator and DTO patterns.

### Scalability & Reliability:

- BullMQ ensures robust, scalable job management.
- Modular design simplifies feature scaling

## 📖 Immediate Future Enhancements

- **Enhanced Documentation:** Provide more detailed README, especially for deployment and environment setup.
- **Testing Strategy:** Extend end-to-end tests coverage.
- **Monitoring & Observability:** Integrate logging (e.g., Winston) and monitoring tools (Prometheus, Grafana).
- **Error Handling & Notifications:** Implement comprehensive error handling with notifications for critical failures.

### Potential Extensions:

- Real-time notifications using WebSockets.
- Advanced analytics on campaign performance.
- Personalisation engine improvements leveraging ML/AI for recommendations.

## 📐 System Flow

```
Customer Data
│
▼
Scheduler (BullMQ Job Scheduler)
│
▼
Email Job Processor
├───► Email Service (nodemailer + Handlebars)
│            └───► SMTP Server
│                       └───► Customer’s Email Inbox
│
└───► Product Recommendation Service
└───► Customer Application (Frontend)
```

## 🗃️ Architecture Overview

```
src/
├── modules/
│   ├── auth/                # Login, Register, JWT Strategy
│   ├── campaign/            # Birthday campaign logic
│   ├── customers/           # Customer CRUD
│   ├── mail/                # Email service with Handlebars
│   ├── products/            # Product suggestion logic
│   └── jobs/                # BullMQ Processor + Scheduler
│   └── seeds/               # Initial Seeding Data
├── config/                  # App, DB, BullMQ, Swagger, Email, Security config
├── common/                  # Interfaces, constants, modules
├── main.ts                  # App bootstrap + Swagger setup
```

## 📨 Birthday Campaign Flow

| Step | Process                                                    |
| ---- | ---------------------------------------------------------- |
| 1️⃣   | Scheduler runs daily at 1 AM (via @nestjs/schedule)        |
| 2️⃣   | CampaignService checks users whose birthday is 7 days away |
| 3️⃣   | A unique discount code is generated (via uuid)             |
| 4️⃣   | Suggested products are fetched from ProductsService        |
| 5️⃣   | Email job is queued using BullMQ                           |
| 6️⃣   | JobsProcessor consumes the job and sends email             |

## 🔐 Auth Flow

- Users register with POST /auth/register
- Login via POST /auth/login
- Receive access_token (JWT)
- Protected routes use @UseGuards(JwtAuthGuard)
- Authenticated user info is injected into req.user

## ⚙️ Configuration

Config files are located under /config, and use NestJS @nestjs/config:

- application.config.ts
- bull.config.ts
- database.config.ts
- swagger.config.ts
- email.config.ts
- security.config.ts

Validation schema `validation.config.ts` uses joi.

## ✅ Git Hooks

Git hooks are powered by husky, lint-staged, and commitlint.

### Pre-commit

- Runs Prettier
- Lints staged files
- Type checks
- Unit tests

### Pre-push

- Full type check
- Full lint
- Full test run

### Commit message validation

- Enforces Conventional Commits

## 🧪 Testing

```bash
# Run all tests
yarn test

# Watch mode
yarn test:watch

# E2E tests
yarn test:e2e

# Test coverage
yarn test:cov
```

## 🐳 Docker Setup

To spin up Postgres and Redis locally:

### 1. Run

```bash
docker compose up -d
```

## 🧑‍💻 Contribution Guide

### Setup

```bash
yarn install
cp .env.example .env
docker compose up -d
```

### Create a new feature

```bash
git checkout -b feat/your-feature
```

### Commit (uses commitlint)

```bash
git commit -m "feat: add feature name"
git push
```

or use the below to get a guided CLI to compose commit messages

```bash
yarn commit
```

> Pre-commit hooks will auto-run tests, lint, type check.

## 📄 License

Built with ❤️ by [@mfmsajidh](https://github.com/mfmsajidh)
