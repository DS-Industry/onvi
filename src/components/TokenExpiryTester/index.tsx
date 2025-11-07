import React, {useEffect} from 'react';
import {Button, View, Text, StyleSheet} from 'react-native';
import {
  mockTokenExpiry,
  setupMockTokenExpiryInterceptor,
} from '../../services/api/mock/mockTokenExpiry';
import useStore from '../../state/store';

/**
 * Component for testing token expiry
 * Only visible in development and when user is authenticated
 */
const TokenExpiryTester: React.FC = () => {
  const isAuthenticated = useStore(state => state.isAuthenticated);

  useEffect(() => {
    // Set up the mock interceptor when the component mounts
    const cleanupInterceptor = setupMockTokenExpiryInterceptor();

    // Clean up the interceptor when the component unmounts
    return () => {
      cleanupInterceptor();
    };
  }, []);

  // Only show in development builds and when authenticated
  if (!__DEV__ || !isAuthenticated) {
    return null;
  }

  const handleTestTokenExpiry = async () => {
    try {
      await mockTokenExpiry();
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚠️ Development Tools</Text>
      <Text style={styles.subtitle}>Test token expiration flow</Text>
      <Button
        title="Simulate Token Expiry"
        onPress={handleTestTokenExpiry}
        color="#f44336"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 16,
    backgroundColor: '#ffe0e0',
    borderRadius: 8,
    borderColor: '#f44336',
    borderWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
});

export default TokenExpiryTester;
