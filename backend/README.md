# CoHabit Backend API Reference

REST API backend for the CoHabit household management application.

## Base URL

```
http://localhost:8080/api
```

All endpoints are prefixed with `/api`.

---

## Authentication

Most endpoints require JWT authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

Tokens are obtained by logging in and expire after 24 hours.

---

## API Endpoints

### Health Check

#### GET `/health`
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

### POST `/auth/register`
Create a new user account.

**Auth Required**: No

**Request Body**:
```json
{
  "email": "user@example.com",
  "username": "username",          // Optional
  "password": "password123",
  "displayName": "Display Name",    // Optional
  "fname": "First",                 // Optional
  "lname": "Last"                   // Optional
}
```

**Validation**:
- `email`: Required, must be valid email format, must be unique
- `username`: Optional, 3-50 characters, must be unique if provided
- `password`: Required, minimum 6 characters
- `displayName`: Optional, max 100 characters

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

### POST `/auth/login`
Login with email/username and password.

**Auth Required**: No

**Request Body**:
```json
{
  "emailOrUsername": "user@example.com",  // Can be email OR username
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
- 400 Bad Request: Missing required fields

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

### POST `/auth/logout`
Logout current user (logs the activity in auth_log table).

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

### POST `/auth/refresh`
Refresh/validate current JWT token.

**Auth Required**: Yes

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Token is still valid",
  "data": null
}
```

**Example**:
```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Profile Management Endpoints

### GET `/profile/me`
Get current user's profile information.

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
    "emailVerified": false,
    "totalXp": 0,
    "level": 1,
    "createdAt": "2025-01-15T10:30:00",
    "updatedAt": "2025-01-15T10:30:00"
  }
}
```

**Example**:
```bash
curl -X GET http://localhost:8080/api/profile/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### PUT `/profile/display-name`
Change current user's display name.

**Auth Required**: Yes

**Request Body**:
```json
{
  "newDisplayName": "New Display Name"
}
```

**Validation**:
- Required, max 100 characters

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Display name updated successfully",
  "data": {
    "id": 1,
    "displayName": "New Display Name",
    // ... other user fields
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

### PUT `/profile/username`
Change current user's username.

**Auth Required**: Yes

**Request Body**:
```json
{
  "newUsername": "newusername"
}
```

**Validation**:
- Required, 3-50 characters
- Must be unique

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Username updated successfully",
  "data": {
    "id": 1,
    "username": "newusername",
    // ... other user fields
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

### POST `/profile/change-password`
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
- `newPassword`: Required, minimum 6 characters

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

### POST `/profile/change-email/request`
Request email change (sends verification code).

**Auth Required**: Yes

**Request Body**:
```json
{
  "newEmail": "newemail@example.com"
}
```

**Validation**:
- Required, must be valid email format
- Must be unique (not already in use)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Verification code sent. Please check your email.",
  "data": {
    "message": "Verification code sent to newemail@example.com",
    "verificationCode": "ABC123"  // FOR TESTING ONLY - in production, only sent via email
  }
}
```

**Notes**:
- Currently using **mock email service** - verification code is returned in the response for testing
- In production, the code would only be sent via email
- Code expires in 15 minutes
- Check server logs for the verification code

**Errors**:
- 409 Conflict: Email already in use

**Example**:
```bash
curl -X POST http://localhost:8080/api/profile/change-email/request \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"newEmail": "newemail@example.com"}'
```

---

### POST `/profile/change-email/verify`
Verify new email with verification code.

**Auth Required**: Yes

**Request Body**:
```json
{
  "email": "newemail@example.com",
  "code": "ABC123"
}
```

**Validation**:
- `email`: Required, must match the email from the request
- `code`: Required, 6-character code

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Email updated successfully",
  "data": {
    "id": 1,
    "email": "newemail@example.com",
    "emailVerified": true,
    // ... other user fields
  }
}
```

**Errors**:
- 400 Bad Request: Invalid or expired verification code
- 400 Bad Request: Code already used

**Example**:
```bash
curl -X POST http://localhost:8080/api/profile/change-email/verify \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newemail@example.com",
    "code": "ABC123"
  }'
```

---

## User Management Endpoints

### GET `/users`
Get all users (admin/testing purposes).

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
      // ... other fields
    },
    {
      "id": 2,
      "email": "user2@example.com",
      "username": "user2",
      // ... other fields
    }
  ]
}
```

**Example**:
```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### GET `/users/{id}`
Get user by ID.

**Auth Required**: Yes

**Path Parameters**:
- `id`: User ID (Long)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    // ... other fields
  }
}
```

**Errors**:
- 404 Not Found: User not found

**Example**:
```bash
curl -X GET http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### GET `/users/email/{email}`
Get user by email address.

**Auth Required**: Yes

**Path Parameters**:
- `email`: User email address

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    // ... other fields
  }
}
```

**Errors**:
- 404 Not Found: User not found

**Example**:
```bash
curl -X GET http://localhost:8080/api/users/email/test@example.com \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### POST `/users`
Create a new user (admin/testing - use `/auth/register` for normal registration).

**Auth Required**: Yes

**Request Body**:
```json
{
  "email": "user@example.com",
  "username": "username",
  "passwordHash": "password123",  // Will be hashed
  "displayName": "Display Name",
  "fname": "First",
  "lname": "Last"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    // ... other fields
  }
}
```

**Errors**:
- 409 Conflict: Email or username already exists

---

### PUT `/users/{id}`
Update user (admin/testing).

**Auth Required**: Yes

**Path Parameters**:
- `id`: User ID

**Request Body** (all fields optional):
```json
{
  "displayName": "New Name",
  "fname": "First",
  "lname": "Last",
  "totalXp": 100,
  "level": 5
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "displayName": "New Name",
    // ... other fields
  }
}
```

**Errors**:
- 404 Not Found: User not found

---

### DELETE `/users/{id}`
Delete user (admin/testing).

**Auth Required**: Yes

**Path Parameters**:
- `id`: User ID

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": null
}
```

**Errors**:
- 404 Not Found: User not found

**Example**:
```bash
curl -X DELETE http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "data": null  // or validation errors for 400 responses
}
```

### Common HTTP Status Codes

| Code | Meaning | When it happens |
|------|---------|----------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validation failed or invalid input |
| 401 | Unauthorized | Invalid credentials or missing/invalid token |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate email/username |
| 500 | Internal Server Error | Unexpected server error |

### Validation Error Example (400)

```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "email": "Email must be valid",
    "password": "Password must be at least 6 characters"
  }
}
```

---

## Technologies

- **Spring Boot 3.2.0** - Application framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database ORM
- **MySQL 8.0** - Database
- **JWT (jjwt 0.12.3)** - Token-based authentication
- **BCrypt** - Password hashing
- **Lombok** - Reduce boilerplate code
- **Jakarta Validation** - Request validation

---

## Project Structure

```
backend/
├── src/main/java/com/cohabit/
│   ├── CoHabitApplication.java           # Main entry point
│   ├── config/
│   │   ├── CorsConfig.java              # CORS configuration
│   │   ├── SecurityConfig.java          # Spring Security config
│   │   └── JwtAuthenticationFilter.java # JWT filter
│   ├── controller/
│   │   ├── HealthController.java        # Health check
│   │   ├── AuthController.java          # Auth endpoints
│   │   ├── ProfileController.java       # Profile endpoints
│   │   └── UserController.java          # User CRUD
│   ├── dto/
│   │   ├── LoginRequest.java           # Login DTO
│   │   ├── RegisterRequest.java        # Registration DTO
│   │   ├── ChangePasswordRequest.java  # Password change DTO
│   │   ├── ChangeEmailRequest.java     # Email change DTO
│   │   ├── ChangeUsernameRequest.java  # Username change DTO
│   │   ├── VerifyEmailRequest.java     # Email verification DTO
│   │   ├── AuthResponse.java           # Auth response DTO
│   │   └── ApiResponse.java            # Generic API response
│   ├── model/
│   │   ├── User.java                   # User entity
│   │   ├── AuthLog.java                # Auth logging entity
│   │   ├── PasswordReset.java          # Password reset entity
│   │   └── VerificationCode.java       # Email verification entity
│   ├── repository/
│   │   ├── UserRepository.java         # User data access
│   │   ├── AuthLogRepository.java      # Auth log data access
│   │   ├── PasswordResetRepository.java
│   │   └── VerificationCodeRepository.java
│   ├── service/
│   │   ├── UserService.java            # User business logic
│   │   ├── AuthService.java            # Auth business logic
│   │   ├── EmailService.java           # Email (mock) service
│   │   └── VerificationService.java    # Verification code logic
│   ├── util/
│   │   └── JwtUtil.java                # JWT utilities
│   └── exception/
│       ├── UserNotFoundException.java
│       ├── InvalidCredentialsException.java
│       ├── EmailAlreadyExistsException.java
│       ├── UsernameAlreadyExistsException.java
│       ├── InvalidVerificationCodeException.java
│       └── GlobalExceptionHandler.java # Global error handling
└── src/main/resources/
    └── application.properties           # Configuration (gitignored)
```

---

## Development Notes

### DTOs (Data Transfer Objects)

DTOs separate the API layer from the database layer:
- **Request DTOs**: Validate incoming data (`LoginRequest`, `RegisterRequest`, etc.)
- **Response DTOs**: Control what data is sent to clients (`AuthResponse`, `ApiResponse`)
- **Never expose** entity classes directly (prevents leaking sensitive fields like `passwordHash`)

### Service Layer Pattern

```
Controller → Service → Repository → Database
```

- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic, validation, orchestration
- **Repositories**: Data access (auto-generated by Spring Data JPA)

### Security

- Passwords hashed with **BCrypt** (12 rounds)
- JWT tokens signed with **HS256**
- Token expiration: **24 hours** (configurable in `application.properties`)
- Protected endpoints validated via `JwtAuthenticationFilter`

### Email Service

Currently using a **mock email service**:
- Verification codes logged to console
- Codes returned in API response (for testing)
- **TODO**: Integrate real email service (AWS SES, SendGrid, etc.)

---

## See Also

- **[Main README](../README.md)** - Project overview and setup
- **[Database Schema](../database/README.md)** - Database documentation
- **[Frontend](../frontend/README.md)** - React Native app
