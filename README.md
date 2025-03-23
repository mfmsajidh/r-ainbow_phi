# 🌈 r-ainbow_phi

A scalable, secure, and event-driven NestJS backend application implementing:

- 🔐 JWT-based Authentication
- 🎂 Birthday Discount Campaign with Cron & BullMQ
- 📦 Product Recommendations
- 📧 Email Notifications via Nodemailer & Handlebars
- 🧪 Testing with Jest
- 🧼 Git Hooks (ESLint, Prettier, Type Check, CommitLint) via Husky

## 📚 Table of Contents

- [🧰 Tech Stack](#-tech-stack)
- [📦 Features](#-features)
- [🚀 Getting Started](#-getting-started)
- [🗃️ Architecture Overview](#️-architecture-overview)
- [📨 Birthday Campaign Flow](#-birthday-campaign-flow)
- [🔐 Auth Flow](#-auth-flow)
- [⚙️ Configuration](#️-configuration)
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

## 📦 Features

- User Registration & Login (Local + JWT)
- Secure Auth with Hashed Passwords
- Daily Cron Job for Birthday Campaign
- Suggested Product Recommendations
- Queued Email Delivery with BullMQ & Redis
- Swagger API Documentation
- Git Hooks: Lint, Format, Test, Commit Validation

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

Copy `.env.example` to `.env.<environment>` and configure the variables

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

> Pre-commit hooks will auto-run tests, lint, type check.

## 📄 License

Built with ❤️ by [@mfmsajidh](https://github.com/mfmsajidh)
