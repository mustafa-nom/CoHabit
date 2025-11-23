# CoHabit Setup Guide

Complete setup instructions for the CoHabit application.

## Prerequisites

### Required Software
- **Java 17+** - [Download](https://adoptium.net/)
- **Maven 3.6+** - [Download](https://maven.apache.org/download.cgi)
- **Node.js 16+** - [Download](https://nodejs.org/)
- **MySQL 8.0+** - Already installed (password: `w66ytLXy`)
- **Expo CLI** - Install with `npm install -g expo-cli`

### Verify Installations
```bash
java -version    # Should show Java 17+
mvn -version     # Should show Maven 3.6+
node -v          # Should show Node 16+
npm -v           # Should show npm version
```

## Step 1: Database Setup ✅

The database is already set up! But if you need to recreate it:

```bash
# Using MySQL command line
mysql -u root -pw66ytLXy < database/complete_setup.sql

# Or use MySQL Workbench
# 1. Open MySQL Workbench
# 2. Connect (password: w66ytLXy)
# 3. Open database/complete_setup.sql
# 4. Execute the script
```

Verify database:
```bash
mysql -u root -pw66ytLXy -e "USE cohabit_db; SHOW TABLES;"
```

## Step 2: Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   mvn clean install
   ```

3. **Configure database** (if needed)
   - Edit `src/main/resources/application.properties`
   - Default settings should work if MySQL is running locally

4. **Run the backend**
   ```bash
   mvn spring-boot:run
   ```

5. **Verify backend is running**
   - Open browser: `http://localhost:8080/api/health`
   - Or use curl: `curl http://localhost:8080/api/health`
   - Should return: `{"status":"UP","message":"CoHabit API is running"}`

## Step 3: Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API URL**
   - Open `src/config/api.js`
   - Update based on your setup:
     ```javascript
     // For iOS Simulator
     const API_BASE_URL = 'http://localhost:8080/api';
     
     // For Android Emulator
     const API_BASE_URL = 'http://10.0.2.2:8080/api';
     
     // For Physical Device (replace with your IP)
     const API_BASE_URL = 'http://192.168.1.100:8080/api';
     ```

4. **Find your computer's IP** (for physical devices)
   ```bash
   # Mac/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

5. **Start the frontend**
   ```bash
   npm start
   ```

6. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app (physical device)

## Step 4: Test the Connection

1. **In the app**: Tap "Check API Connection" button
2. **Should see**: "API Status: UP"
3. **Navigate to Users**: Tap "View Users" to see user list

## Troubleshooting

### Backend Issues

**Port 8080 already in use**
```bash
# Change port in backend/src/main/resources/application.properties
server.port=8081
```

**Database connection failed**
- Verify MySQL is running: `mysql -u root -pw66ytLXy`
- Check credentials in `application.properties`
- Ensure database exists: `SHOW DATABASES;`

**Maven build fails**
- Ensure Java 17+ is installed
- Clean and rebuild: `mvn clean install`

### Frontend Issues

**Cannot connect to API**
- Verify backend is running: `curl http://localhost:8080/api/health`
- Check API URL in `src/config/api.js`
- For physical devices, ensure phone and computer are on same network
- Check firewall settings (port 8080)

**Expo issues**
- Clear cache: `expo start -c`
- Reinstall: `rm -rf node_modules && npm install`

**Network errors on Android**
- Use `10.0.2.2` instead of `localhost` in API URL

### Database Issues

**Tables not found**
- Run setup script: `mysql -u root -pw66ytLXy < database/complete_setup.sql`

**Connection refused**
- Verify MySQL is running
- Check MySQL port (default: 3306)

## Development Workflow

1. **Start MySQL** (if not running as service)
2. **Start Backend**: `cd backend && mvn spring-boot:run`
3. **Start Frontend**: `cd frontend && npm start`
4. **Make changes** and see them hot-reload

## Project Structure

```
CoHabit/
├── backend/
│   ├── src/main/java/com/cohabit/
│   │   ├── CoHabitApplication.java
│   │   ├── config/          # CORS, etc.
│   │   ├── controller/      # REST endpoints
│   │   ├── model/           # Entity classes
│   │   └── repository/      # Data access
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── config/          # API configuration
│   │   ├── services/        # API service methods
│   │   └── screens/         # React Native screens
│   └── App.js
└── database/
    ├── schema.sql           # Database schema
    └── complete_setup.sql   # Full setup script
```

## Next Steps

- Add authentication (JWT tokens)
- Implement household management
- Add task creation and assignment
- Add user profile screens
- Add notifications
- Add chat functionality

## Support

For issues or questions:
1. Check the README files in each directory
2. Review error messages carefully
3. Verify all prerequisites are installed
4. Check that services are running (MySQL, Backend)

