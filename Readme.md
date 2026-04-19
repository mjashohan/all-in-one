<div align="center">

# All-In-One

### A personal brand platform, service marketplace, and productivity hub — all under one roof.

[![Java](https://img.shields.io/badge/Java-25-ED8B00?style=flat&logo=openjdk&logoColor=white)](https://openjdk.org/projects/jdk/25/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.5-6DB33F?style=flat&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Spring Security](https://img.shields.io/badge/Spring%20Security-7-6DB33F?style=flat&logo=springsecurity&logoColor=white)](https://spring.io/projects/spring-security)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![MUI](https://img.shields.io/badge/MUI-9-007FFF?style=flat&logo=mui&logoColor=white)](https://mui.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](#license)

</div>

---

## Overview

**All-In-One** is a full-stack web platform that combines four pillars into a single product:

1. **Personal brand website** — portfolio, about, contact.
2. **Service marketplace** — request-based paid services, with room for future payment integration.
3. **Content hub** — blog with SEO-friendly structure and (planned) YouTube integration.
4. **Productivity app host** — a logged-in workspace where users track tasks and usage.

The codebase is split cleanly between a **Spring Boot 4 / Java 25** backend and a **React 19 + Vite + MUI v9** frontend, with JWT-based stateless authentication bridging the two.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Default Admin Credentials](#default-admin-credentials)
- [Roadmap](#roadmap)
- [License](#license)
- [Author](#author)

## Features

### Authentication & Authorization
- Username/password registration and login
- JWT-based stateless auth (HS512, 24-hour expiry)
- Role-based access control — `USER` and `ADMIN`
- BCrypt password hashing
- Auto-seeded default admin on first boot

### Service Requests
- Authenticated users submit requests by service type and description
- Users see only their own submissions (`/my`)
- Admins see all, filter by status, update status (`PENDING` → `IN_PROGRESS` → `DONE` / `REJECTED`), and delete

### Blog System
- Public read access for all posts, by category, or by keyword search
- Admin-only create, update, delete
- SEO-ready schema (slug, meta tags, excerpt, view count) in the DB layer

### Projects / Portfolio
- Public listing and search
- Admin-only CRUD for managing portfolio items

### Contact / Messages
- Public contact form submissions (no auth required)
- Admins view, filter by sender email, and delete

### User Management
- Admin-only user listing and lookup
- Soft role-based deletion safeguards on the frontend

### Admin Dashboard
- Tabbed view with counts for users, requests, and messages
- Inline status transitions and delete actions
- Stat cards at a glance

## Tech Stack

### Backend
| Layer | Technology |
| --- | --- |
| Runtime | Java 25 |
| Framework | Spring Boot 4.0.5 |
| Security | Spring Security 7 (lambda DSL, stateless) |
| Data | Spring Data JPA + Spring Data REST |
| Database | MySQL 8.0+ |
| Auth Tokens | JJWT 0.13.0 |
| Validation | Jakarta Bean Validation |
| Boilerplate | Lombok |
| Build | Maven (wrapper included) |

### Frontend
| Layer | Technology |
| --- | --- |
| Framework | React 19 |
| Build Tool | Vite 6 |
| UI Library | Material UI v9 (+ Emotion) |
| Routing | React Router v7 |
| HTTP Client | Axios |

## Project Structure

```
all-in-one/
├── pom.xml                                  Backend build config
├── mvnw, mvnw.cmd                           Maven wrapper
├── src/
│   ├── main/
│   │   ├── java/com/shohan/allinone/
│   │   │   ├── AllInOneApplication.java     Entry point
│   │   │   ├── config/                      Security, data seeding, exceptions
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   ├── DataInitializer.java
│   │   │   │   └── GlobalExceptionHandler.java
│   │   │   ├── controller/                  REST endpoints
│   │   │   ├── dto/                         Request/Response DTOs
│   │   │   ├── entity/                      JPA entities
│   │   │   ├── repository/                  Spring Data repositories
│   │   │   ├── security/                    JWT filter
│   │   │   ├── service/                     Business logic
│   │   │   └── util/                        JwtUtil
│   │   └── resources/
│   │       ├── application.properties       DB, JWT, server config
│   │       ├── database/schema.sql          Full MySQL schema (extended)
│   │       ├── static/index.html            Backend landing page
│   │       └── frontend/                    React app (see below)
│   └── test/                                Context-load tests
└── README.md
```

### Frontend layout

```
src/main/resources/frontend/
├── package.json, vite.config.js, index.html
└── src/
    ├── api/                     Axios client + one file per resource
    ├── components/              Navbar, Layout, RouteGuards, etc.
    ├── contexts/AuthContext.jsx Login, register, logout, isAdmin
    ├── pages/                   Home, Login, Register, Dashboards, etc.
    ├── theme/theme.js           MUI palette + typography
    ├── utils/storage.js         Platform-agnostic storage wrapper
    ├── App.jsx                  Route map
    └── main.jsx                 Entry point
```

The frontend is structured so that a future React Native port only needs to swap the view layer — API calls, auth state, and storage are already isolated behind portable interfaces.

## Prerequisites

- **Java 25** (OpenJDK or equivalent)
- **Maven 3.9+** (or use the included wrapper: `./mvnw`)
- **MySQL 8.0+** running locally or remotely
- **Node.js 18+** and **npm** (for the frontend)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mjashohan/all-in-one.git
cd all-in-one
```

### 2. Set up the database

Create the database using the provided schema:

```bash
mysql -u root -p < src/main/resources/database/schema.sql
```

This creates the `all_in_one` database with all tables. Hibernate's `ddl-auto=update` will keep it in sync with your entities on startup.

### 3. Configure the backend

Update `src/main/resources/application.properties` to match your local setup:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/all_in_one?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=<your-mysql-user>
spring.datasource.password=<your-mysql-password>

# Override this in production
jwt.secret=<your-long-secret-key-at-least-64-chars>
jwt.expiration=86400000
```

> **Note:** For production, set `jwt.secret` via an environment variable or externalized config — don't commit real secrets.

### 4. Run the backend

```bash
./mvnw spring-boot:run
```

The API is now live at **http://localhost:8080**. The default admin is auto-created on first boot (see [credentials below](#default-admin-credentials)).

### 5. Run the frontend

```bash
cd src/main/resources/frontend
npm install
npm run dev
```

The app opens at **http://localhost:3000** and proxies `/api/*` to the backend — no CORS config needed in development.

## API Reference

### Auth (`/api/auth`)
| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Log in and receive a JWT |

### Users (`/api/users`) — **Admin only**
| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/users` | List all users |
| GET | `/api/users/{id}` | Get user by ID |
| GET | `/api/users/by-username/{username}` | Get user by username |
| DELETE | `/api/users/{id}` | Delete a user |

### Service Requests (`/api/service-requests`)
| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/service-requests` | Authenticated | Submit a request |
| GET | `/api/service-requests/my` | Authenticated | Get own requests |
| GET | `/api/service-requests` | Admin | List all |
| GET | `/api/service-requests/{id}` | Admin | Get by ID |
| GET | `/api/service-requests/by-status/{status}` | Admin | Filter by status |
| PATCH | `/api/service-requests/{id}/status` | Admin | Update status |
| DELETE | `/api/service-requests/{id}` | Admin | Delete |

### Blogs (`/api/blogs`)
| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/blogs` | Public | List all |
| GET | `/api/blogs/{id}` | Public | Get by ID |
| GET | `/api/blogs/category/{category}` | Public | Filter by category |
| GET | `/api/blogs/search?keyword=...` | Public | Search by title |
| POST | `/api/blogs` | Admin | Create |
| PUT | `/api/blogs/{id}` | Admin | Update |
| DELETE | `/api/blogs/{id}` | Admin | Delete |

### Projects (`/api/projects`)
| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/projects` | Public | List all |
| GET | `/api/projects/{id}` | Public | Get by ID |
| GET | `/api/projects/search?keyword=...` | Public | Search by title |
| POST | `/api/projects` | Admin | Create |
| PUT | `/api/projects/{id}` | Admin | Update |
| DELETE | `/api/projects/{id}` | Admin | Delete |

### Messages (`/api/messages`)
| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/messages` | Public | Submit contact form |
| GET | `/api/messages` | Admin | List all |
| GET | `/api/messages/{id}` | Admin | Get by ID |
| GET | `/api/messages/by-email?email=...` | Admin | Filter by sender email |
| DELETE | `/api/messages/{id}` | Admin | Delete |

### Authentication header

For protected endpoints, include the JWT in the `Authorization` header:

```http
Authorization: Bearer <your-jwt-token>
```

## Default Admin Credentials

On first startup, `DataInitializer` seeds an admin account if none exists:

| Field    | Value                                         |
|----------|-----------------------------------------------|
| Username | `admin`                                       |
| Password | `{Yousuf, tumi jano ki password disi ami xD}` |
| Email    | `admin@allinone.com`                          |
| Role     | `ADMIN`                                       |

> **Change this password immediately in production.**

## Roadmap

Based on the original project brief, the following features are planned:

- [ ] Productivity app integration with per-user usage tracking (study / work / personal categories)
- [ ] Task CRUD and completion tracking
- [ ] Password reset flow via email
- [ ] YouTube channel integration (latest videos, embedded player)
- [ ] Payment gateway integration for paid services
- [ ] Advanced analytics dashboard for admins
- [ ] Email notifications for new service requests and messages
- [ ] Social login (Google, GitHub) — optional
- [ ] React Native mobile app (the frontend is structured for this)
- [ ] Production deployment (Docker, CI/CD)

## License

This project is licensed under the MIT License — feel free to use it as a starting point for your own work.

## Author

**Muhammad Jahan Ali Shohan** — [GitHub profile](https://github.com/mjashohan)

Built with Spring Boot, React, and a fair amount of coffee.

---