import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return <SafeAreaProvider>
    <Stack >
      <Stack.Screen  name="index" options={{headerShown:false}}/>
      <Stack.Screen  name="Book" options={{headerShown:false}}/>
      <Stack.Screen name="editProfile" options={{headerShown:false}}/>
      <Stack.Screen name="addPet" options={{headerShown:false}}/>
      <Stack.Screen name="myPets" options={{headerShown:false}}/>
      <Stack.Screen name="PetProfile" options={{headerShown:false}}/>
      <Stack.Screen name="AddVaccination" options={{headerShown:false}}/>
      <Stack.Screen name="eBook" options={{headerShown:false}}/>
      <Stack.Screen name="VacDetails" options={{headerShown:false}}/>
      <Stack.Screen name="Appointment" options={{headerShown:false}}/>
      <Stack.Screen name="Payment" options={{headerShown:false}}/>
       <Stack.Screen name="PetShopsView" options={{headerShown:false}}/>
        <Stack.Screen name="ShopView" options={{headerShown:false}}/>
         <Stack.Screen name="PetFood" options={{headerShown:false}}/>
          <Stack.Screen name="Home" options={{headerShown:false}}/>
    </Stack>

    
  </SafeAreaProvider>
}