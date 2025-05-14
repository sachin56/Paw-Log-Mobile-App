import React, { useEffect, useState } from "react";
import { 
  View, Text, TouchableOpacity, StyleSheet, Image, 
  Dimensions, ScrollView, ActivityIndicator, RefreshControl 
} from "react-native";
import { apiRequest } from "../utils/apiHandler"; 

const { width, height } = Dimensions.get("window");

const HomeScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("post", "general-management/menu");
        console.log("API Response:", response.data);  // Log response to debug

        // Ensure data is an array and append it to existing data
        if (Array.isArray(response.data)) {
          setData((prevData) => [...prevData, ...response.data]);  // Append new data
        } else {
          setData([]);  // In case the response isn't an array, reset it to an empty array
        }
      } catch (err) {
        setError("Failed to fetch data");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData(); // Call the fetchData function to refresh
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {/* Circular Loader */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      ) : (
        <>
          {/* Header */}
          <View style={styles.topContainer}>
            <View style={styles.imageWrapper}>
              <Image source={require("../../../assets/images/happy.png")} style={styles.logo} />
            </View>
            <Text style={styles.welcomeText}>Welcome Home!</Text>
          </View>

          {/* Error Handling */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <>
              {/* Cards or Empty Data */}
              {data.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                  <Text style={styles.emptyStateText}>No Data Available</Text>
                </View>
              ) : (
                <ScrollView
                  contentContainerStyle={styles.cardContainer}
                  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                  }
                >
                  <View style={styles.rowContainer}>
                    {Array.isArray(data) && data.map((item, index) => (
                      <TouchableOpacity key={index} style={styles.smallCard}>
                        <Image source={{ uri: item.backgroundImageUrl }} style={styles.cardBackground} />
                        <View style={styles.overlay} />
                        <Image source={{ uri: item.logoImageUrl }} style={styles.cardLogo} />
                        <Text style={styles.description}>{item.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              )}
            </>
          )}
        </>
      )}

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity style={styles.fab} onPress={() => console.log("FAB Clicked!")}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },

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

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },

  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 18,
    color: "#888",
  },

  cardContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },

  // Row container for 2 cards inline
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",  // Ensure cards are spaced evenly
    flexWrap: "wrap",  // Wrap cards to the next line if needed
    width: "100%",
    paddingHorizontal: 10,
  },

  smallCard: {
    width: "48%", // Makes each card take up roughly half of the row
    height: width * 0.42,
    borderRadius: 15,
    marginVertical: 8,
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
  description: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    paddingTop: 10,
  },

  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabText: {
    fontSize: 30,
    color: "#FFF",
    fontWeight: "bold",
  },
});


export default HomeScreen;
