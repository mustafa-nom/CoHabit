# CoHabit

Household management and chore tracking application.

## Tech Stack

- **Backend**: Java Spring Boot (REST API)
- **Frontend**: React Native with Expo
- **Database**: MySQL

## Project Structure

```
CoHabit/
├── backend/          # Java Spring Boot API
├── frontend/         # React Native mobile app
└── database/         # Database schema and setup scripts
```

## Quick Start

### 1. Database Setup ✅

The MySQL database is already set up and connected!

- Database: `cohabit_db`
- All 12 tables created
- Connection tested and working

See `database/README.md` for details.

### 2. Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on: `http://localhost:8080/api`

See `backend/README.md` for full documentation.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go (physical device)

**Important**: Update `frontend/src/config/api.js` with your API URL:
- iOS Simulator: `http://localhost:8080/api`
- Android Emulator: `http://10.0.2.2:8080/api`
- Physical Device: `http://YOUR_IP:8080/api`

See `frontend/README.md` for full documentation.

## API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

## Database Schema

All 12 tables are created and ready:
- **Core**: users, households, members
- **Tasks**: tasks, task_assignments, task_completions
- **Auth**: auth_log, password_reset, verification_codes
- **Other**: requests, user_stats, notifications

See `database/README.md` for full schema documentation.

## Development

### Backend Development
- Java 17+
- Maven for dependency management
- Spring Boot 3.2.0
- Spring Data JPA for database access

### Frontend Development
- React Native with Expo
- Axios for API calls
- React Navigation for routing

## Testing the Connection

1. **Start Backend**: `cd backend && mvn spring-boot:run`
2. **Test API**: `curl http://localhost:8080/api/health`
3. **Start Frontend**: `cd frontend && npm start`
4. **Check Connection**: Use the "Check API Connection" button in the app

## Next Steps

- [ ] Add authentication endpoints
- [ ] Implement household management
- [ ] Add task management features
- [ ] Set up user authentication in frontend
- [ ] Add more screens and navigation