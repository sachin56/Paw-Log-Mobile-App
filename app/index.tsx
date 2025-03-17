import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../app/(root)/Welcome/welcome';
import LoginScreen from '../app/(root)/Auth/Login';

const Stack = createStackNavigator();

const AppNavigator = () => {
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
