import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../app/(root)/Welcome/welcome';
import LoginScreen from '../app/(root)/Auth/Login';
import { useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const Stack = createStackNavigator();

const AppNavigator = () => {
  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: '633281982604-ii05qrgsgg6tqso7k5v46eq5auqj08j2.apps.googleusercontent.com',
      profileImageSize: 150,
    });
  });
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="WelcomeScreen" 
        component={WelcomeScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="LoginScreen" 
        component={LoginScreen}
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
