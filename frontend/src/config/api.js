// API Configuration
// Update this with your backend URL
// For local development with Android emulator, use: http://10.0.2.2:8080
// For local development with iOS simulator, use: http://localhost:8080
// For physical device, use your computer's IP address: http://192.168.x.x:8080

const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:8080/api'  // Android emulator uses 10.0.2.2 to reach host machine
  : 'https://your-production-api.com/api';

export default API_BASE_URL;

