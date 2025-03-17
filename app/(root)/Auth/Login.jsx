import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Get device dimensions for responsive layout
const { height } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle Login logic
  const handleLogin = () => {
    if (email && password) {
      console.log("Logging in with", email, password);
      navigation.navigate("Home"); // Replace with your target screen
    } else {
      console.log("Please enter both email and password.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Container with Yellow Card Background */}
      <LinearGradient colors={["#FFD700", "#FFA500"]} style={styles.topContainer}>
        <View style={styles.yellowCard}>
          <Text style={styles.brandText}>MyApp</Text>
          <View style={styles.imageWrapper}>
            <Image source={require("../../../assets/images/dog.jpg")} style={styles.dogImage} />
          </View>
        </View>
       </LinearGradient>

      {/* Bottom Container for Login Form */}
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Please login to continue</Text>

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        {/* Login Button */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Register Link */}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.registerText}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FFF", 
    justifyContent: "center", 
    alignItems: "center" 
  },

  // Top background with yellow card
  topContainer: {
    width: "100%",
    height: height * 0.7, // Increased height of yellow card
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    backgroundColor: "#FFD700", // Yellow color for the top card
    alignItems: "center",
    justifyContent: "center",
    position: "absolute", 
    top: 0,
    width: "100%",
    height: height * 0.7, // Increased height of yellow card
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,

  },

  // Yellow Card Background
  yellowCard: {
    backgroundColor: "#FFD700",
    width: "80%",
    height: "50%",  // Increased height of the yellow card
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },

  brandText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 20,
  },

  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  dogImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  // Bottom Container for Login Form
  bottomContainer: {
    position: "absolute",
    top: height * 0.55,  // Adjust to position the form below the yellow card
    width: "90%",  // Increased width for better form visibility
    alignItems: "center",
    backgroundColor: "#fff",  // White background to highlight the form
    padding: 30,  // Added padding for spacing
    borderRadius: 20,  // Rounded corners for the form
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
    position: "absolute", // Keep it above the yellow card
    top: height * 0.50,  // Centered vertically in the screen
    width: "90%",  // Form width
    alignItems: "center",
    backgroundColor: "#fff",  // White background for the form
    padding: 30,  // Added padding for spacing
    borderRadius: 20,  // Rounded corners for the form
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },

  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",  // Background color for the inputs
  },

  button: {
    backgroundColor: "#FFA500",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },

  registerButton: {
    marginTop: 15,
  },
  registerText: {
    color: "#007BFF",
    fontSize: 16,
  },
});

export default LoginScreen;
