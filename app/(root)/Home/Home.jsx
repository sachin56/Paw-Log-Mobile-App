import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, ScrollView, ActivityIndicator } from "react-native";
import { apiRequest } from "../utils/apiHandler"; 
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const { width, height } = Dimensions.get("window");

const HomeScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = await AsyncStorage.getItem('token');

  // Use the apiRequest method from apiHandler
  axios.get('https://shop.bitdottechnologies.com/api/general-management/menu', {
    timeout: 300000, // 5 minutes in milliseconds
    headers: {
      'Authorization': '2|f1Fm2LAKtaO8InctwdJGn8Ht6H99wQ1Cqk9TNKDR8a4bd9de',
      'Content-Type': 'application/json',
    }
  })
  .then(response => console.log(response.data))
  .catch(error => console.error('Axios Error:', error.response || error));

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.topContainer}>
        <View style={styles.imageWrapper}>
          <Image source={require("../../../assets/images/happy.png")} style={styles.logo} />
        </View>
        <Text style={styles.welcomeText}>Welcome Home!</Text>
      </View>

      {/* Cards Section */}
      <ScrollView contentContainerStyle={styles.cardContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFD700" />
        ) : (
          <View style={styles.rowContainer}>
            {data.map((item, index) => (
              <TouchableOpacity key={index} style={styles.smallCard}>
                <Image source={{ uri: item.backgroundImageUrl }} style={styles.cardBackground} />
                <View style={styles.overlay} />
                <Image source={{ uri: item.logoImageUrl }} style={styles.cardLogo} />
                <Text style={styles.cardTitle}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  /* Header */
  topContainer: {
    width: "100%",
    height: height * 0.35,
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
  logo: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },

  /* Cards */
  cardContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  rowContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "90%",
  },
  smallCard: {
    width: width * 0.42,
    height: width * 0.42,
    borderRadius: 15,
    margin: 8,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#FFA500",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  cardBackground: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  cardLogo: {
    width: 50,
    height: 50,
    tintColor: "#FFF",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
});

export default HomeScreen;
