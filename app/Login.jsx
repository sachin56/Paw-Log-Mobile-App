import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "./utils/apiHandler"; 
import { SignUp } from "./Register"; 


const { width, height } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest("POST", "login", { email, password,fcm_token:'23445' });

      if (response?.token) {
        await AsyncStorage.setItem("token", response.token);
        navigation.replace("Home"); 
      } else {
        Alert.alert("Login Failed", response?.message || "Invalid credentials.");
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo); // Use this info for authentication or redirect
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled the login process");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Login is in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Play services are not available");
      } else {
        console.log("Error", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.imageWrapper}>
          <Image source={require("../assets/images/happy.png")} style={styles.logo} />
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Signing In..." : "Sign In"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  topContainer: {
    width: "100%",
    height: height * 0.4,
    backgroundColor: "#FFD700",
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  imageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    overflow: "hidden",
  },
  logo: { width: "80%", height: "80%", resizeMode: "contain" },
  bottomContainer: { alignItems: "center", marginTop: 20, paddingHorizontal: 20 },
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center", color: "#333", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 20 },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#FFF",
  },
  forgotPassword: { alignSelf: "flex-end", color: "#FFA500", marginBottom: 20 },
  button: {
    backgroundColor: "#FFA500",
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#FFA500",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },

    // Google Login Button Style
    googleButton: {
      backgroundColor: "#4285F4", // Google blue
      paddingVertical: 15,
      width: "100%",
      alignItems: "center",
      borderRadius: 10,
      marginTop: 15,
      shadowColor: "#4285F4",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 6,
    },
    googleButtonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#FFF",
    },
  
  buttonText: { fontSize: 18, fontWeight: "bold", color: "#FFF" },
  signupText: { color: "#FFA500", fontSize: 16 },
});

export default LoginScreen;
