# CoHabit

A simple household management application for organizing tasks and coordinating with housemates.

## Features

- 🔐 **User Authentication** - Secure login and signup
- 🏠 **Household Management** - Create or join households with invite codes
- ✅ **Task Management** - Create, assign, and complete tasks
- 📋 **Task List View** - View all tasks with name, description, and complete button
- 👤 **Profile Management** - Update display name, username, and password

## Tech Stack

- **Backend**: Java Spring Boot 3.2.0 (REST API)
- **Frontend**: React 18 with Vite
- **Database**: MySQL 8.0
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Tailwind CSS v4

## Project Structure

```
CoHabit/
├── backend/          # Java Spring Boot REST API
├── frontend-web/     # React web application
└── database/         # MySQL schema and setup scripts
```

---

## Quick Start

### Prerequisites

- Java 17+
- Maven 3.6+
- MySQL 8.0+
- Node.js 18+

### 1. Database Setup

**Create the database:**
```sql
CREATE DATABASE cohabit_db;
USE cohabit_db;
SOURCE /path/to/database/schema.sql;
```

See [`database/README.md`](database/README.md) for detailed setup instructions.

### 2. Backend Setup

**Step 1: Configure Environment**

Copy the example configuration:
```bash
cd backend/src/main/resources
cp application.properties.example application.properties
```

Edit `application.properties` and update:
```properties
# Database credentials
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD

# JWT secret (MUST change in production!)
jwt.secret=YOUR_SECURE_RANDOM_STRING_AT_LEAST_64_CHARACTERS
```

**Generate JWT Secret:**
```bash
openssl rand -base64 64
```

**Step 2: Run the Backend**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs at: `http://localhost:8080/api`

See [`backend/README.md`](backend/README.md) for API documentation.

### 3. Frontend Setup

```bash
cd frontend-web
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

See [`frontend-web/README.md`](frontend-web/README.md) for development details.

---

## Testing the Application

### 1. Register a new user
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "displayName": "Test User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "test@example.com",
    "password": "password123"
  }'
```

**Save the `token` from the response!**

### 3. Access your profile
```bash
curl -X GET http://localhost:8080/api/profile/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## API Endpoints

### Authentication
| Endpoint | Method | Auth? | Description |
|----------|--------|-------|-------------|
| `/api/health` | GET | No | Health check |
| `/api/auth/register` | POST | No | Create account |
| `/api/auth/login` | POST | No | Login |
| `/api/auth/logout` | POST | Yes | Logout |

### Profile Management
| Endpoint | Method | Auth? | Description |
|----------|--------|-------|-------------|
| `/api/profile/me` | GET | Yes | Get current user |
| `/api/profile/display-name` | PUT | Yes | Change display name |
| `/api/profile/username` | PUT | Yes | Change username |
| `/api/profile/change-password` | POST | Yes | Change password |

See [`backend/README.md`](backend/README.md) for complete API reference.

---

## Project Status

- [x] Database schema
- [x] Backend API (Spring Boot + MySQL)
- [x] JWT authentication
- [x] User registration & login
- [x] Profile management
- [x] React web frontend
- [ ] Household management endpoints
- [ ] Task CRUD endpoints
- [ ] Task assignment system
- [ ] Task completion tracking

---

## Documentation

- **[Backend API Reference](backend/README.md)** - Complete endpoint documentation
- **[Frontend Development](frontend-web/README.md)** - React web app setup
- **[Database Schema](database/README.md)** - Table definitions & setup

---

## Configuration Files

### Backend: `application.properties`

**Location**: `backend/src/main/resources/application.properties`

```properties
# Server
server.port=8080
server.servlet.context-path=/api

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/cohabit_db
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD

# JWT
jwt.secret=YOUR_SECURE_RANDOM_STRING_MINIMUM_64_CHARACTERS
jwt.expiration=86400000
```

**⚠️ IMPORTANT**: This file contains secrets and is in `.gitignore`.

### Frontend: Environment Variables

**Location**: `frontend-web/.env.development`

```
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## Troubleshooting

### Backend Issues

**Port already in use**
```bash
# Change port in application.properties
server.port=8081
```

**Database connection failed**
- Verify MySQL is running: `mysql -u root -p`
- Check credentials in `application.properties`
- Ensure `cohabit_db` database exists

### Frontend Issues

**Can't connect to backend**
- Verify backend is running: `curl http://localhost:8080/api/health`
- Check `VITE_API_BASE_URL` in `.env.development`

### Authentication Issues

**"Unauthorized" errors**
- Token may be expired (expires in 24 hours) - login again
- Ensure token format: `Authorization: Bearer <token>`

---

## Development

### Backend Architecture

```
Controllers (REST endpoints)
    ↓
Services (Business logic)
    ↓
Repositories (Database access)
    ↓
Database (MySQL)
```

### Git Workflow

```bash
git pull origin main
# Make changes
git add .
git commit -m "Description of changes"
git push origin your-branch-name
```

**⚠️ NEVER commit:**
- `backend/src/main/resources/application.properties`
- `.env` files with credentials
- Database passwords or JWT secrets

---

## Security Notes

🔒 **For Production Deployment:**

1. Change JWT secret to a cryptographically secure random string (64+ chars)
2. Use environment variables for all secrets
3. Enable HTTPS/SSL
4. Restrict CORS to specific origins (not `*`)
5. Use strong database passwords
6. Never commit credentials to version control

---

## License

Private - All Rights Reserved
