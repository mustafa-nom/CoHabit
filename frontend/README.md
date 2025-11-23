# CoHabit Frontend (React Native)

Mobile application built with React Native and Expo.

## Prerequisites

- Node.js 16+ and npm
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (for testing)
- Backend API running on `http://localhost:8080/api`

## Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure API URL**
   - Open `src/config/api.js`
   - Update `API_BASE_URL` based on your setup:
     - **iOS Simulator**: `http://localhost:8080/api`
     - **Android Emulator**: `http://10.0.2.2:8080/api`
     - **Physical Device**: `http://YOUR_COMPUTER_IP:8080/api`
       - Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)

3. **Start the App**
   ```bash
   npm start
   ```
   
   Then:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app (physical device)

## Project Structure

```
frontend/
├── src/
│   ├── config/
│   │   └── api.js              # API base URL configuration
│   ├── services/
│   │   └── api.js              # API service methods
│   └── screens/
│       ├── HomeScreen.js       # Home screen with API health check
│       └── UsersScreen.js       # Users list screen
├── App.js                       # Main app component with navigation
├── app.json                     # Expo configuration
└── package.json                 # Dependencies
```

## Features

- ✅ API health check
- ✅ User list display
- ✅ Pull-to-refresh
- ✅ Error handling
- ✅ Loading states

## API Integration

The app uses Axios for HTTP requests. All API calls are centralized in `src/services/api.js`.

### Example: Using the API Service

```javascript
import { userService } from '../services/api';

// Get all users
const users = await userService.getAllUsers();

// Create a user
const newUser = await userService.createUser({
  email: 'user@example.com',
  passwordHash: 'hashed_password',
  displayName: 'John Doe'
});
```

## Development

### Adding New Screens

1. Create screen component in `src/screens/`
2. Add route in `App.js`:
   ```javascript
   <Stack.Screen name="NewScreen" component={NewScreen} />
   ```
3. Navigate to it:
   ```javascript
   navigation.navigate('NewScreen');
   ```

### Adding New API Endpoints

1. Add method to `src/services/api.js`:
   ```javascript
   export const newService = {
     getData: async () => {
       const response = await api.get('/endpoint');
       return response.data;
     }
   };
   ```

## Troubleshooting

### Cannot Connect to API

1. **Check Backend is Running**
   - Verify backend is running on port 8080
   - Test: `curl http://localhost:8080/api/health`

2. **Update API URL**
   - For physical devices, use your computer's IP address
   - Make sure phone and computer are on same network

3. **Check Firewall**
   - Ensure port 8080 is not blocked

### Expo Issues

- Clear cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Network Errors

- For Android emulator, use `10.0.2.2` instead of `localhost`
- For iOS simulator, `localhost` works fine
- For physical devices, use your computer's local IP address

## Building for Production

See [Expo documentation](https://docs.expo.dev/build/introduction/) for building standalone apps.

