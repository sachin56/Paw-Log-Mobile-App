import React, { useEffect, useRef } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import LoginScreen from '../Auth/Login';

const { width, height } = Dimensions.get("window");

const WelcomeScreen = ({ navigation }) => {
  const scaleAnim1 = useRef(new Animated.Value(1)).current; // Animation for first paw print
  const scaleAnim2 = useRef(new Animated.Value(1)).current; // Animation for second paw print

  useEffect(() => {
    // Scale animation for bouncing effect
    const bounceEffect = (anim) => {
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1.2, // Scale up
          duration: 800,
          useNativeDriver: true, // Use native driver for scaling
        }),
        Animated.timing(anim, {
          toValue: 1, // Scale back to original size
          duration: 800,
          useNativeDriver: true, // Use native driver for scaling
        }),
      ]).start();
    };

    // Start the scale animation for both paw prints
    bounceEffect(scaleAnim1);
    bounceEffect(scaleAnim2);
    const interval = setInterval(() => {
      bounceEffect(scaleAnim1);
      bounceEffect(scaleAnim2);
    }, 3000); // Repeat every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [scaleAnim1, scaleAnim2]);

  return (
    <View style={styles.container}>
      {/* Top Gradient Background */}
      <LinearGradient colors={["#FFD700", "#FFA500"]} style={styles.topContainer}>
        <View style={styles.imageWrapper}>
          <Image source={require("../../../assets/images/happy.png")} style={styles.dogImage} />
        </View>

        {/* Static Paw Log Text (No Animation) */}
        <Text style={styles.brandText}>Paw Log</Text>

        {/* Animated Paw Prints */}
        <View style={styles.pawPrintContainer}>
          {/* Animated Paw Print 1 */}
          <Animated.Image
            source={require("../../../assets/images/paws.png")} // Replace with your paw image path
            style={[styles.pawPrintImage, { top: 30, left: 40, transform: [{ scale: scaleAnim1 }] }]} // Position + animation
          />
          {/* Animated Paw Print 2 */}
          <Animated.Image
            source={require("../../../assets/images/paws.png")}
            style={[styles.pawPrintImage, { top: 100, right: 50, transform: [{ scale: scaleAnim2 }] }]} // Position + animation
          />
        </View>
      </LinearGradient>

      {/* Bottom White Content */}
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Let's Find Together{"\n"}Your Friend with Us</Text>
        <Text style={styles.subtitle}>Join us in connecting with your perfect pet companion.</Text>

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => {
            console.log('Navigating to LoginScreen');
            navigation.navigate("LoginScreen");
          }}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },

  // Top background with gradient and circular image
  topContainer: {
    width: "100%",
    height: height * 0.7, // Increased height of yellow card
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    position: "relative",
  },
  brandText: {
    position: "absolute",
    bottom: 20,
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  imageWrapper: {
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: "hidden",
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
  },
  dogImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  // Paw Print Image Style
  pawPrintContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  pawPrintImage: {
    width: 50, // Paw size
    height: 50, // Paw size
    resizeMode: "contain",
    position: "absolute",
  },

  // Bottom text content
  bottomContainer: {
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: 20,
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

  // Get Started Button
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
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
});

export default WelcomeScreen;
