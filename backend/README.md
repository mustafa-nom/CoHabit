# CoHabit Backend API

REST API backend for the CoHabit household management application.

## Features

- 🔐 **JWT Authentication** - Secure token-based auth
- 👤 **User Management** - Registration, login, profile updates
- 🏠 **Household Management** - Create and join households (planned)
- ✅ **Task Management** - Create, assign, and complete tasks (planned)

## Tech Stack

- **Spring Boot 3.2.0** - Application framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database ORM
- **MySQL 8.0** - Database
- **JWT (jjwt 0.12.3)** - Token-based authentication
- **BCrypt** - Password hashing
- **Lombok** - Reduce boilerplate code

## Base URL

```
http://localhost:8080/api
```

All endpoints are prefixed with `/api`.

## Prerequisites

- Java 17+
- Maven 3.6+
- MySQL 8.0+

## Setup

### 1. Configure Database

Copy the example configuration:
```bash
cd src/main/resources
cp application.properties.example application.properties
```

Edit `application.properties`:
```properties
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
jwt.secret=YOUR_SECURE_RANDOM_STRING_64_CHARS
```

Generate JWT secret:
```bash
openssl rand -base64 64
```

### 2. Run the Application

```bash
mvn clean install
mvn spring-boot:run
```

API runs at: **http://localhost:8080/api**

## Authentication

Most endpoints require JWT authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

Tokens are obtained by logging in and expire after 24 hours.

---

## API Endpoints

### Health Check

#### `GET /health`

Check if the API is running.

**Auth Required**: No

**Response**:
```json
{
  "status": "UP"
}
```

**Example**:
```bash
curl http://localhost:8080/api/health
```

---

## Authentication Endpoints

### `POST /auth/register`

Create a new user account.

**Auth Required**: No

**Request Body**:
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "displayName": "Display Name"
}
```

**Validation**:
- `email`: Required, valid format, unique
- `username`: Optional, 3-50 chars, unique if provided
- `password`: Required, min 6 chars
- `displayName`: Optional, max 100 chars

**Response** (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "userId": 1,
    "email": "user@example.com",
    "username": "username",
    "displayName": "Display Name"
  }
}
```

**Errors**:
- 409 Conflict: Email or username already exists
- 400 Bad Request: Validation failed

**Example**:
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

---

### `POST /auth/login`

Login with email/username and password.

**Auth Required**: No

**Request Body**:
```json
{
  "emailOrUsername": "user@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "userId": 1,
    "email": "user@example.com",
    "username": "username",
    "displayName": "Display Name"
  }
}
```

**Errors**:
- 404 Not Found: User not found
- 401 Unauthorized: Invalid password

**Example**:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "test@example.com",
    "password": "password123"
  }'
```

---

### `POST /auth/logout`

Logout current user.

**Auth Required**: Yes

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

**Example**:
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Profile Management

### `GET /profile/me`

Get current user's profile.

**Auth Required**: Yes

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "displayName": "Display Name",
    "fname": "First",
    "lname": "Last",
    "createdAt": "2025-01-15T10:30:00",
    "updatedAt": "2025-01-15T10:30:00"
  }
}
```

**Example**:
```bash
curl http://localhost:8080/api/profile/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### `PUT /profile/display-name`

Change current user's display name.

**Auth Required**: Yes

**Request Body**:
```json
{
  "newDisplayName": "New Display Name"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Display name updated successfully",
  "data": {
    "id": 1,
    "displayName": "New Display Name",
    ...
  }
}
```

**Example**:
```bash
curl -X PUT http://localhost:8080/api/profile/display-name \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"newDisplayName": "John Doe"}'
```

---

### `PUT /profile/username`

Change current user's username.

**Auth Required**: Yes

**Request Body**:
```json
{
  "newUsername": "newusername"
}
```

**Validation**:
- Required, 3-50 characters, must be unique

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Username updated successfully",
  "data": {
    "id": 1,
    "username": "newusername",
    ...
  }
}
```

**Errors**:
- 409 Conflict: Username already taken

**Example**:
```bash
curl -X PUT http://localhost:8080/api/profile/username \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"newUsername": "johndoe"}'
```

---

### `POST /profile/change-password`

Change current user's password.

**Auth Required**: Yes

**Request Body**:
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Validation**:
- `currentPassword`: Required
- `newPassword`: Required, min 6 characters

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": null
}
```

**Errors**:
- 400 Bad Request: Current password is incorrect

**Example**:
```bash
curl -X POST http://localhost:8080/api/profile/change-password \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword456"
  }'
```

---

## User Management (Admin/Testing)

### `GET /users`

Get all users.

**Auth Required**: Yes

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "email": "user1@example.com",
      "username": "user1",
      ...
    }
  ]
}
```

---

### `GET /users/{id}`

Get user by ID.

**Auth Required**: Yes

**Path Parameters**: `id` (User ID)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    ...
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

### HTTP Status Codes

| Code | Meaning | When it happens |
|------|---------|----------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created |
| 400 | Bad Request | Validation failed |
| 401 | Unauthorized | Invalid credentials or token |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate email/username |
| 500 | Internal Server Error | Unexpected error |

---

## Project Structure

```
backend/
├── src/main/java/com/cohabit/
│   ├── CoHabitApplication.java
│   ├── config/
│   │   ├── CorsConfig.java
│   │   ├── SecurityConfig.java
│   │   └── JwtAuthenticationFilter.java
│   ├── controller/
│   │   ├── HealthController.java
│   │   ├── AuthController.java
│   │   ├── ProfileController.java
│   │   └── UserController.java
│   ├── dto/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── AuthResponse.java
│   │   └── ApiResponse.java
│   ├── model/
│   │   ├── User.java
│   │   └── AuthLog.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   └── AuthLogRepository.java
│   ├── service/
│   │   ├── UserService.java
│   │   └── AuthService.java
│   ├── util/
│   │   └── JwtUtil.java
│   └── exception/
│       ├── GlobalExceptionHandler.java
│       └── Custom exceptions...
└── src/main/resources/
    └── application.properties
```

---

## Security

- **Password Hashing**: BCrypt with 12 rounds
- **JWT Tokens**: HS256 algorithm
- **Token Expiration**: 24 hours (configurable)
- **CORS**: Configured for web frontend

---

## Development Notes

### Adding New Endpoints

1. Create DTO in `dto/` package
2. Add method to Service class
3. Create Controller endpoint
4. Test with curl or Postman

### Database Changes

1. Update entity in `model/`
2. Spring JPA auto-updates schema (or run migration manually)
3. Update DTOs if needed

---

## See Also

- [Main README](../README.md) - Project overview
- [Database Schema](../database/README.md) - Database documentation
- [Frontend](../frontend-web/README.md) - React web app

---

## License

Private - All Rights Reserved
