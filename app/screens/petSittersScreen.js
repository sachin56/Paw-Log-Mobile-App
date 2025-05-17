import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";

import RNPickerSelect from "react-native-picker-select";
import { Picker } from "@react-native-picker/picker"; // `npm install @react-native-picker/picker`
import { useState, useEffect } from "react";
import axios from "axios"; // or use fetch

const { height } = Dimensions.get("window"); // Get full screen height
const TOP_HEIGHT = height * 0.3; // 30% of the screen height

import { Ionicons } from "@expo/vector-icons";

function PetSittersScreen() {
  const [petSitters, setPetSitters] = useState([]);
  const [petNames, setPetNames] = useState([]);
  const [petInfo, setPetInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = "3|VJOYginmIkbvdDDjm1UsUWg6YIHKfjKLoZwZz31Z7ff5c58f";

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.post(
          "https://shop.bitdottechnologies.com/api/pet-management/get-all-pet",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPetNames(
          response.data.data
            .map((e) => e.name)
            .map((e) => {
              return { label: e, value: e };
            })
        );
        setPetInfo(response.data.data);
      } catch (err) {
        console.error("Failed to fetch pets:", err);
        setError("Could not load pets.");
      } finally {
        setLoading(false);
      }
    };

    const fetchPetSitters = async () => {
      try {
        let response = await axios.get(
          "https://shop.bitdottechnologies.com/api/pet-sitter",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        response.data.data = response.data.data.slice(2);

        let tempSitters = response.data.data.map((e) => {
          return {
            id: e.id,
            email: e.email,
            name: e.name,
            phone: e.phone_number,
            livingArea: e.address.split(",").pop().trim(),
            experience: `${e.expirence.toString()} years`,
          };
        });

        const mergedArray = tempSitters.map((item, index) => {
          const source =
            petSittersAdditionalInfo[index % petSittersAdditionalInfo.length]; // wrap-around using modulo
          return {
            ...item,
            ...source, // merge source properties into item
          };
        });
        setPetSitters(mergedArray);
      } catch (err) {
        console.error("Failed to fetch sitters:", err);
        setError("Could not load sitters.");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
    fetchPetSitters();
  }, []);

  const petSittersAdditionalInfo = [
    {
      age: 28,
      details: "Loves animals and has a big backyard.",
      availability: ["Mon 9AM-12PM", "Wed 2PM-5PM", "Fri 10AM-3PM"],
    },
    {
      age: 32,
      details: "Experienced with all kinds of pets.",
      availability: ["Tue 1PM-6PM", "Thu 9AM-4PM", "Sat 10AM-2PM"],
    },
    {
      age: 25,
      details:
        "Specializes in exotic pets and reptiles. Veterinary student part-time.",
      availability: ["Mon 9AM-12PM", "Wed 2PM-5PM", "Fri 10AM-3PM"],
    },
    {
      age: 30,
      details:
        "Runs a small pet sanctuary at home. Certified in pet first aid.",
      availability: ["Tue 1PM-6PM", "Thu 9AM-4PM", "Sat 10AM-2PM"],
    },
    {
      age: 45,
      details:
        "Retired zookeeper offering premium pet care services. Expert with large dogs.",
      availability: ["Mon 9AM-12PM", "Wed 2PM-5PM", "Fri 10AM-3PM"],
    },
  ];

  const [selectedPet, setSelectedPet] = React.useState(null);

  function PetSitterCard({ sitter }) {
    const renderStars = (rating) => {
      const stars = [];
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 >= 0.5;

      // Full stars
      for (let i = 0; i < fullStars; i++) {
        stars.push(
          <Ionicons key={`full-${i}`} name="star" size={16} color="#FFD700" />
        );
      }

      // Half star
      if (hasHalfStar) {
        stars.push(
          <Ionicons key="half" name="star-half" size={16} color="#FFD700" />
        );
      }

      // Empty stars
      const emptyStars = 5 - stars.length;
      for (let i = 0; i < emptyStars; i++) {
        stars.push(
          <Ionicons
            key={`empty-${i}`}
            name="star-outline"
            size={16}
            color="#FFD700"
          />
        );
      }

      return stars;
    };

    const handleBookPress = async () => {
      const selectedPetObj = petInfo.find((pet) => pet.name === selectedPet);

      if (!selectedPetObj) {
        alert("Please select a pet.");
        return;
      }

      const selectedPetId = selectedPetObj.id;
      const selectedSitterId = sitter.id;

      try {
        let response = await axios.post(
          "https://shop.bitdottechnologies.com/api/pet-sitter/request",
          {
            pet_id: selectedPetId,
            pet_sitter_id: selectedSitterId,
            note: "eeeeeeee",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        response.data.data = response.data.data.slice(2);
      } catch (err) {
        console.error("Failed to book:", err);
        setError("Could not book.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Ionicons name="person-circle" size={40} color="#666" />
          <View style={styles.headerText}>
            <Text style={styles.name}>
              {sitter.name} - {sitter.livingArea}
            </Text>
            <View style={styles.ratingContainer}>
              {renderStars(sitter.rating)}
              <Text style={styles.ratingText}>{sitter.rating}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Age: {sitter.age}</Text>
          <Text style={styles.detailText}>
            Experience: {sitter.experience} | {sitter.phone}
          </Text>

          <Text style={styles.sectionTitle}>Available Time Slots:</Text>
          <View style={styles.timeSlotsContainer}>
            {sitter.availability.map((slot, index) => (
              <View key={index} style={styles.timeSlot}>
                <Text style={styles.timeSlotText}>{slot}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.details}>{sitter.details}</Text>

          {/* Book Now Button */}
          <TouchableOpacity style={styles.bookButton} onPress={handleBookPress}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Full-screen background */}
      <View style={styles.background}>
        {/* Yellow 30% Section */}
        <View style={styles.topBackground}>
          <Text style={styles.title}>Pet Sitters</Text>
          <Image
            source={require("../assets/petSitter.jpg")} // Replace with your image path
            style={styles.headerImage}
            resizeMode="contain"
          />
        </View>

        {/* White 70% Section with Cards */}
        <View style={styles.bottomBackground}>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={selectedPet}
              onValueChange={(itemValue) => setSelectedPet(itemValue)}
              style={styles.pickerInput}
            >
              {/* <Picker.Item label="Select Pet..." value={null} /> */}
              {petNames.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>

          <FlatList
            data={petSitters}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PetSitterCard sitter={item} />}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  topBackground: {
    height: TOP_HEIGHT,
    backgroundColor: "#FFDD00",
    paddingTop: 30, // Push content down from top
    alignItems: "center", // Center horizontally
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 15, // Space between title and image
  },
  headerImage: {
    width: "80%", // Take up 80% of container width
    height: "60%", // Take up 50% of remaining space
    maxHeight: 120, // Maximum height for the image
  },
  bottomBackground: {
    flex: 1, // Remaining 70% of screen
    backgroundColor: "#FFFFFF",
    paddingTop: 20, // Push cards down slightly for spacing
    zIndex: 0,
  },
  listContainer: {
    paddingHorizontal: 20, // Add padding on sides
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerText: {
    marginLeft: 10,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#666",
  },
  detailsContainer: {
    marginTop: 10,
  },
  detailText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
    marginTop: 10,
    marginBottom: 6,
  },
  timeSlotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  timeSlot: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  timeSlotText: {
    fontSize: 13,
    color: "#555",
  },
  bookButton: {
    backgroundColor: "#FFDD00", // Yellow to match your theme
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  dropdownContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
  },

  dropdownContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  pickerInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
    color: "#333",
    justifyContent: "center",
  },
});

export default PetSittersScreen;
