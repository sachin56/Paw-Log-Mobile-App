import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const { height } = Dimensions.get("window");
const TOP_HEIGHT = height * 0.3;

function PetSittersScreen() {
  const [petSitters, setPetSitters] = useState([]);
  const [petNames, setPetNames] = useState([]);
  const [petInfo, setPetInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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
          response.data.data.map((e) => ({
            label: e.name,
            value: e.name,
          }))
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

        let tempSitters = response.data.data.map((e) => ({
          id: e.id,
          email: e.email,
          name: e.name,
          phone: e.phone_number,
          livingArea: e.address.split(",").pop().trim(),
          experience: `${e.expirence.toString()} years`,
        }));

        const mergedArray = tempSitters.map((item, index) => {
          const source =
            petSittersAdditionalInfo[index % petSittersAdditionalInfo.length];
          return {
            ...item,
            ...source,
            rating: 4.5, // Add a default rating since it’s used in renderStars
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

  function PetSitterCard({ sitter }) {
    const renderStars = (rating) => {
      const stars = [];
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 >= 0.5;

      for (let i = 0; i < fullStars; i++) {
        stars.push(
          <Ionicons key={`full-${i}`} name="star" size={16} color="#FFD700" />
        );
      }

      if (hasHalfStar) {
        stars.push(
          <Ionicons key="half" name="star-half" size={16} color="#FFD700" />
        );
      }

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
        await axios.post(
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
        alert("Booking successful!");
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
          <Ionicons name="person quebra-circle" size={40} color="#666" />
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

          <TouchableOpacity style={styles.bookButton} onPress={handleBookPress}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        <View style={styles.topBackground}>
          <Text style={styles.title}>Pet Sitters</Text>
          <Image
            source={require("../assets/petSitter.jpg")}
            style={styles.headerImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.bottomBackground}>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.customPicker}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.customPickerText}>
                {selectedPet || "Select Pet..."}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#333" />
            </TouchableOpacity>

            <Modal
              visible={modalVisible}
              transparent
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Select a Pet</Text>
                  <ScrollView>
                    {petNames.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={styles.modalItem}
                        onPress={() => {
                          setSelectedPet(option.value);
                          setModalVisible(false);
                        }}
                      >
                        <Text style={styles.modalItemText}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>

          <FlatList
            data={petSitters}
            keyExtractor={(item) => item.id.toString()}
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
    paddingTop: 30,
    alignItems: "center",
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 15,
  },
  headerImage: {
    width: "80%",
    height: "60%",
    maxHeight: 120,
  },
  bottomBackground: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    zIndex: 0,
  },
  listContainer: {
    paddingHorizontal: 20,
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
    backgroundColor: "#FFDD00",
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
  customPicker: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  customPickerText: {
    fontSize: 16,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#FFDD00",
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});

export default PetSittersScreen;