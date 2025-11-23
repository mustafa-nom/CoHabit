# CoHabit Backend (Java Spring Boot)

REST API backend for the CoHabit application.

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+ (database should already be set up)
- MySQL running on localhost:3306

## Setup

1. **Install Dependencies**
   ```bash
   cd backend
   mvn clean install
   ```

2. **Database Configuration**
   - The database `cohabit_db` should already be created
   - Connection settings are in `src/main/resources/application.properties`
   - Default credentials:
     - Host: localhost:3306
     - Database: cohabit_db
     - Username: root
     - Password: w66ytLXy

3. **Run the Application**
   ```bash
   mvn spring-boot:run
   ```
   
   Or run the main class: `com.cohabit.CoHabitApplication`

The API will be available at: `http://localhost:8080/api`

## API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/email/{email}` - Get user by email
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

## Example API Calls

### Create User
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "passwordHash": "hashed_password",
    "displayName": "Test User",
    "fname": "Test",
    "lname": "User"
  }'
```

### Get All Users
```bash
curl http://localhost:8080/api/users
```

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/cohabit/
│   │   │   ├── CoHabitApplication.java    # Main application class
│   │   │   ├── config/
│   │   │   │   └── CorsConfig.java        # CORS configuration
│   │   │   ├── controller/
│   │   │   │   ├── HealthController.java  # Health check endpoint
│   │   │   │   └── UserController.java     # User CRUD endpoints
│   │   │   ├── model/
│   │   │   │   └── User.java              # User entity
│   │   │   └── repository/
│   │   │       └── UserRepository.java    # User data access
│   │   └── resources/
│   │       └── application.properties     # Configuration
│   └── test/
└── pom.xml                                 # Maven dependencies
```

## Technologies

- **Spring Boot 3.2.0** - Framework
- **Spring Data JPA** - Database access
- **MySQL Connector** - Database driver
- **Lombok** - Reduce boilerplate code

## Development

### Adding New Entities

1. Create model class in `model/` package
2. Create repository interface in `repository/` package
3. Create controller in `controller/` package
4. Follow the same pattern as `User`

### CORS Configuration

CORS is configured to allow all origins for development. Update `CorsConfig.java` for production restrictions.

## Troubleshooting

### Port Already in Use
Change the port in `application.properties`:
```
server.port=8081
```

### Database Connection Failed
- Verify MySQL is running
- Check database credentials in `application.properties`
- Ensure database `cohabit_db` exists

### Build Errors
- Ensure Java 17+ is installed: `java -version`
- Clean and rebuild: `mvn clean install`

