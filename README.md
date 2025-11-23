# CoHabit

Household management and chore tracking application with gamification features.

## Tech Stack

- **Backend**: Java Spring Boot 3.2.0 (REST API)
- **Frontend**: React Native with Expo
- **Database**: MySQL 8.0
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
CoHabit/
├── backend/          # Java Spring Boot API
├── frontend/         # React Native mobile app
└── database/         # Database schema and setup scripts
```

---

## Quick Start

### Prerequisites

- Java 17+
- Maven 3.6+
- MySQL 8.0+
- Node.js 16+ & npm
- Expo CLI (install with `npm install -g expo-cli`)

### 1. Database Setup

See [`database/MYSQL_WORKBENCH_GUIDE.md`](database/MYSQL_WORKBENCH_GUIDE.md) for detailed MySQL Workbench setup.

**Quick version:**
```sql
CREATE DATABASE cohabit_db;
USE cohabit_db;
SOURCE /path/to/database/schema.sql;
```

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
- **Mac/Linux**: `openssl rand -base64 64`
- **Windows**: Use [random.org/api-token-generator](https://api.random.org/strings/?num=1&len=64&digits=on&upperalpha=on&loweralpha=on)

**Step 2: Run the Backend**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs at: `http://localhost:8080/api`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

**Configure API URL** in `frontend/src/config/api.js`:
- **iOS Simulator**: `http://localhost:8080/api`
- **Android Emulator**: `http://10.0.2.2:8080/api`
- **Physical Device**: `http://YOUR_IP_ADDRESS:8080/api`

Find your IP:
- Mac: System Preferences → Network
- Windows: `ipconfig` (look for IPv4 Address)
- Linux: `ip addr` or `ifconfig`

Then launch the app:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR with Expo Go app (physical device)

---

## API Documentation

**See [`backend/README.md`](backend/README.md) for complete API reference with examples.**

### Authentication Flow

1. **Register**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login` → Receive JWT token
3. **Use Token**: Add header to all protected requests:
   ```
   Authorization: Bearer <YOUR_JWT_TOKEN>
   ```

### Quick Reference

| Endpoint | Method | Auth? | Description |
|----------|--------|-------|-------------|
| `/api/health` | GET | No | Health check |
| `/api/auth/register` | POST | No | Create account |
| `/api/auth/login` | POST | No | Login |
| `/api/auth/logout` | POST | Yes | Logout |
| `/api/profile/me` | GET | Yes | Get current user |
| `/api/profile/display-name` | PUT | Yes | Change display name |
| `/api/profile/username` | PUT | Yes | Change username |
| `/api/profile/change-password` | POST | Yes | Change password |
| `/api/profile/change-email/request` | POST | Yes | Request email change |
| `/api/profile/change-email/verify` | POST | Yes | Verify email change |

See [`backend/README.md`](backend/README.md) for full endpoint list and examples.

---

## Testing the API

### 1. Register a new user
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
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

### 3. Access protected endpoint
```bash
curl -X GET http://localhost:8080/api/profile/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Change password
```bash
curl -X POST http://localhost:8080/api/profile/change-password \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword456"
  }'
```

---

## Database Schema

12 tables supporting authentication, households, tasks, and gamification:

- **Core**: `users`, `households`, `members`
- **Tasks**: `tasks`, `task_assignments`, `task_completions`
- **Auth**: `auth_log`, `password_reset`, `verification_codes`
- **Other**: `requests`, `user_stats`, `notifications`

See [`database/README.md`](database/README.md) for complete schema documentation.

---

## Configuration Files

### Backend: `application.properties`

**Location**: `backend/src/main/resources/application.properties`

```properties
# Server
server.port=8080
server.servlet.context-path=/api

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/cohabit_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD

# JWT (CHANGE jwt.secret IN PRODUCTION!)
jwt.secret=YOUR_SECURE_RANDOM_STRING_MINIMUM_64_CHARACTERS
jwt.expiration=86400000
```

**⚠️ IMPORTANT**: This file contains secrets and is in `.gitignore`. Use `application.properties.example` as a template.

### Frontend: API Configuration

**Location**: `frontend/src/config/api.js`

```javascript
export const API_BASE_URL = 'http://localhost:8080/api';  // Update based on your environment
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

**Build errors**
```bash
java -version  # Ensure Java 17+
mvn clean install  # Clean rebuild
```

### Frontend Issues

**Can't connect to backend**
- Verify backend is running: `curl http://localhost:8080/api/health`
- Android emulator: Use `10.0.2.2` instead of `localhost`
- Physical device: Use your computer's IP address

**Expo not starting**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Authentication Issues

**"Unauthorized" errors**
- Check JWT token is included in `Authorization` header
- Token may be expired (expires in 24 hours) - login again
- Ensure token format: `Bearer <token>` (note the space)

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

**Key Concepts:**
- **DTOs (Data Transfer Objects)**: Separate API structure from database models
- **JWT Authentication**: Stateless token-based auth
- **BCrypt**: Password hashing for security
- **Spring Security**: Endpoint protection

### Adding New Features

1. **Backend**:
   - Create model in `model/` package
   - Create repository in `repository/`
   - Create service in `service/`
   - Create controller in `controller/`
   - Follow existing patterns (e.g., `UserController`, `UserService`)

2. **Frontend**:
   - See [`frontend/README.md`](frontend/README.md)

### Git Workflow

```bash
git pull origin main
# Make changes
git add .
git commit -m "Description of changes"
git push origin your-branch-name
```

**⚠️ NEVER commit:**
- `backend/src/main/resources/application.properties` (contains passwords & secrets)
- Database passwords or JWT secrets
- `.env` files with real credentials

---

## Project Status

- [x] Database schema (12 tables)
- [x] Backend API (Spring Boot + MySQL)
- [x] JWT authentication
- [x] User registration & login
- [x] Profile management (change password, email, username, display name)
- [ ] Household management
- [ ] Task system with XP/points
- [ ] Leaderboard
- [ ] Frontend UI (React Native)
- [ ] Push notifications

---

## Documentation

- **[Backend API Reference](backend/README.md)** - Complete endpoint documentation
- **[Frontend Development](frontend/README.md)** - React Native setup & development
- **[Database Schema](database/README.md)** - Table definitions & relationships
- **[MySQL Setup Guide](database/MYSQL_WORKBENCH_GUIDE.md)** - Step-by-step database setup

---

## Security Notes

🔒 **For Production Deployment:**

1. **Change JWT secret** to a cryptographically secure random string (64+ chars)
2. **Use environment variables** instead of `application.properties` for secrets
3. **Enable HTTPS/SSL**
4. **Restrict CORS** to specific origins (not `*`)
5. **Use strong database passwords**
6. **Store secrets in a vault** (AWS Secrets Manager, HashiCorp Vault, etc.)
7. **Never commit** `application.properties` or files with credentials

---

## License

MIT License - See LICENSE file for details
