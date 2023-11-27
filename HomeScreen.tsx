import * as LocalAuthentication from 'expo-local-authentication';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

type AuthOptions = {
  availableAuthentication: boolean;
  authenticationTypes: string[];
};

type HomeScreenProps = {
  navigation: NavigationProp<Record<string, object>>;
};  
  
const HomeScreen = ({ navigation }: HomeScreenProps) => {

  const [authOptions, setAuthOptions] = useState<AuthOptions>({
    availableAuthentication: false,
    authenticationTypes: [],
  });

  const verifyAuthentication = async () => {
    const availableAuthentication =
      await LocalAuthentication.hasHardwareAsync();

    if (!availableAuthentication) return;

    const authenticationTypes =
      await LocalAuthentication.supportedAuthenticationTypesAsync();

    setAuthOptions({
      availableAuthentication,
      authenticationTypes: authenticationTypes.map(
        (type) => LocalAuthentication.AuthenticationType[type]
      ),
    });
  };

  const handleAuthentication = async () => {
    if (!authOptions.availableAuthentication) {
      return Alert.alert('Authentication', 'Please set authentication');
    }
    const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!isBiometricEnrolled) {
      return Alert.alert('Authentication', 'Biometry not found.');
    }

    const auth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authentication with biometry',
      fallbackLabel: 'Biometry not recognized',
    });

    if (auth.success) {
      navigation.navigate('TodoList', {})
    } else {
      return Alert.alert('Authentication', 'Authentication failed!');
    }
  };

  useEffect(() => {
    verifyAuthentication();
  }, []);

  return (
      <View style={styles.container}>
        <StatusBar style="auto" />
  
        <Text style={[styles.text]}>
          Set Authentication to Proceed
        </Text>
  
        <TouchableOpacity style={styles.roundButton} onPress={handleAuthentication}>
          <Text style={styles.buttonText}>Go to setting</Text>
        </TouchableOpacity>
      </View>
  );  
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 30,
      paddingVertical: 40
    },
    text: {
      fontSize: 22,
      marginTop: 10,
      textAlign: 'center',
    },
    textBold: {
      fontWeight: 'bold',
      marginTop: 20,
    },
    roundButton: {
      backgroundColor: '#0b63ea', // Your desired background color
      borderRadius: 50, // Half of the width and height to make it round
      paddingVertical: 10,
      paddingHorizontal: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  