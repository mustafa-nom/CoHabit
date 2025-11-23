import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { healthCheck } from '../services/api';

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);

  const checkApiHealth = async () => {
    setLoading(true);
    try {
      const response = await healthCheck();
      setApiStatus(response.status);
      Alert.alert('Success', `API Status: ${response.status}\n${response.message}`);
    } catch (error) {
      setApiStatus('DOWN');
      Alert.alert(
        'Connection Error',
        'Could not connect to the backend API. Make sure:\n\n' +
        '1. Backend server is running on port 8080\n' +
        '2. Update API_BASE_URL in src/config/api.js if needed\n' +
        '3. For physical devices, use your computer\'s IP address'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CoHabit</Text>
      <Text style={styles.subtitle}>Household Management App</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>API Status:</Text>
        <Text style={[styles.status, apiStatus === 'UP' ? styles.statusUp : styles.statusDown]}>
          {apiStatus || 'Unknown'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={checkApiHealth}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Check API Connection</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonSecondary]}
        onPress={() => navigation.navigate('Users')}
      >
        <Text style={styles.buttonTextSecondary}>View Users</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  statusLabel: {
    fontSize: 16,
    marginRight: 10,
    color: '#666',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusUp: {
    color: '#4CAF50',
  },
  statusDown: {
    color: '#F44336',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 15,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

