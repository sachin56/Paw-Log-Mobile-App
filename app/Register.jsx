import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "./utils/apiHandler"; // Adjust path as needed

const { width, height } = Dimensions.get("window");

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email ||!phone_number || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest("POST", "register", { name, email, password,phone_number });

      if (response?.token) {
        await AsyncStorage.setItem("token", response.token);
        navigation.replace("Home"); 
      } else {
        Alert.alert("Registration Failed", response?.message || "Something went wrong.");
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
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
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
        />
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
          placeholder="Phone Number"
          placeholderTextColor="#666"
          value={phone_number}
          onChangeText={setPhoneNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#666"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Signing Up..." : "Sign Up"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>Already have an account? Sign In</Text>
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
  buttonText: { fontSize: 18, fontWeight: "bold", color: "#FFF" },
  loginText: { color: "#FFA500", fontSize: 16 },
});

export default SignUpScreen;
