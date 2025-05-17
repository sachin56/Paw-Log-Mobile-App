import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";

const { height } = Dimensions.get("window");
const TOP_HEIGHT = height * 0.3;

const sitterJobs = [
  {
    id: "1",
    name: "Golden Retriever",
    breed: "Golden Retriever",
    petName: "Buddy",
    phone: "0771234567",
    livingArea: "Colombo",
    age: 3,
    sittingTime: "Sun 9AM-5PM",
    feedingSchedule: [
      "Morning (8:00 AM): 2 cups of high-protein dry dog food",
      "Afternoon (12:00 PM): 1 cup of dry dog food with vegetables",
      "Evening (6:00 PM): 2 cups with cooked chicken or fish",
    ],
    medicine: [
      "Canine: 1 tablet with food in the morning",
      "Joint supplements for hip health",
    ],
    allergies: ["Grapes, Pineapple, Peanut"],
    exercises: [
      "Morning Walk (7:00 AM): 30-45 minutes",
      "Evening Walk (5:00 PM): 30 minutes with play",
    ],
  },
  {
    id: "2",
    name: "Labrador",
    breed: "Labrador Retriever",
    petName: "Charlie",
    phone: "0772233445",
    livingArea: "Kandy",
    age: 4,
    sittingTime: "Sat 8AM-6PM",
    feedingSchedule: [
      "Morning (7:30 AM): 1.5 cups of dry food with fish oil",
      "Evening (6:30 PM): 2 cups of kibble with boiled chicken",
    ],
    medicine: ["Multivitamin: 1 tablet with breakfast"],
    allergies: ["Dairy, Soy"],
    exercises: [
      "Morning Run (6:30 AM): 40 minutes",
      "Evening Playtime (5:30 PM): Fetch in the backyard",
    ],
  },
  // {
  //   id: "3",
  //   name: "Beagle",
  //   breed: "Beagle",
  //   petName: "Max",
  //   phone: "0775566778",
  //   livingArea: "Galle",
  //   age: 2,
  //   sittingTime: "Fri 10AM-4PM",
  //   feedingSchedule: [
  //     "Morning (9:00 AM): 1 cup of dry food with bone broth",
  //     "Evening (7:00 PM): 1.5 cups of kibble with boiled beef",
  //   ],
  //   medicine: [],
  //   allergies: ["None"],
  //   exercises: [
  //     "Morning Walk (8:00 AM): 20 minutes",
  //     "Evening Play (6:00 PM): Tug-of-war and hide-and-seek",
  //   ],
  // },
  // {
  //   id: "4",
  //   name: "Poodle",
  //   breed: "Poodle",
  //   petName: "Bella",
  //   phone: "0776677889",
  //   livingArea: "Negombo",
  //   age: 5,
  //   sittingTime: "Mon 8AM-2PM",
  //   feedingSchedule: [
  //     "Morning (8:00 AM): 1 cup of hypoallergenic kibble",
  //     "Evening (6:00 PM): 1 cup of cooked salmon with rice",
  //   ],
  //   medicine: ["Omega-3 supplement: 1 capsule with dinner"],
  //   allergies: ["Chicken, Wheat"],
  //   exercises: [
  //     "Morning Agility Training (9:00 AM): 30 minutes",
  //     "Evening Walk (5:30 PM): 40 minutes",
  //   ],
  // },
  {
    id: "5",
    name: "Shih Tzu",
    breed: "Shih Tzu",
    petName: "Luna",
    phone: "0779988776",
    livingArea: "Jaffna",
    age: 6,
    sittingTime: "Wed 9AM-3PM",
    feedingSchedule: [
      "Morning (9:00 AM): 1/2 cup of wet food with soft kibble",
      "Evening (7:00 PM): 1/2 cup of wet food with mashed sweet potato",
    ],
    medicine: ["Joint Support: 1 chewable tablet with breakfast"],
    allergies: ["Beef, Corn"],
    exercises: [
      "Morning Walk (8:30 AM): 15 minutes",
      "Evening Indoor Play (6:00 PM): Light play with toys",
    ],
  },
];

import { Ionicons } from "@expo/vector-icons";

function JobCard({ job }) {
  const handleApplyPress = () => {
    console.log(`Applying for ${job.petName}'s job`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="paw" size={40} color="#666" />
        <View style={styles.headerText}>
          <Text style={styles.name}>{job.petName}</Text>
          <Text style={styles.breed}>
            {job.breed} ({job.age} years)
          </Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Sitting Time: {job.sittingTime}</Text>
        <Text style={styles.detailText}>Contact: {job.phone}</Text>

        <Text style={styles.sectionTitle}>Feeding Schedule:</Text>
        <View style={styles.timeSlotsContainer}>
          {job.feedingSchedule.map((slot, index) => (
            <View key={index} style={styles.timeSlot}>
              <Text style={styles.timeSlotText}>{slot}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Medication:</Text>
        <View style={styles.timeSlotsContainer}>
          {job.medicine.length > 0 ? (
            job.medicine.map((med, index) => (
              <View key={index} style={styles.timeSlot}>
                <Text style={styles.timeSlotText}>{med}</Text>
              </View>
            ))
          ) : (
            <View style={styles.timeSlot}>
              <Text style={styles.timeSlotText}>No medication required</Text>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Allergies:</Text>
        <View style={styles.timeSlotsContainer}>
          <View style={styles.timeSlot}>
            <Text style={styles.timeSlotText}>{job.allergies.join(", ")}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Exercise Routine:</Text>
        <View style={styles.timeSlotsContainer}>
          {job.exercises.map((exercise, index) => (
            <View key={index} style={styles.timeSlot}>
              <Text style={styles.timeSlotText}>{exercise}</Text>
            </View>
          ))}
        </View>

        {/* <TouchableOpacity style={styles.bookButton} onPress={handleApplyPress}>
          <Text style={styles.bookButtonText}>Apply Now</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}

function JobListingsScreen() {
  const [selectedTab, setSelectedTab] = useState(sitterJobs[0].id);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        {/* Yellow 30% Section */}
        <View style={styles.topBackground}>
          <Text style={styles.title}>Job Listings</Text>
          {/* <Text style={styles.title}> </Text>
          <Text style={styles.title}>Dhanushka M</Text>0 */}
          <Image
            source={require("../assets/jobListing.jpg")}
            style={styles.headerImage}
            resizeMode="contain"
          />
        </View>

        {/* White 70% Section with Cards */}
        <View style={styles.bottomBackground}>
          {/* Horizontal Scrollable Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabContainer}
            contentContainerStyle={styles.tabContentContainer}
          >
            {sitterJobs.map((job) => (
              <TouchableOpacity
                key={job.id}
                style={[
                  styles.tabItem,
                  selectedTab === job.id && styles.selectedTabItem,
                ]}
                onPress={() => setSelectedTab(job.id)}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === job.id && styles.selectedTabText,
                  ]}
                >
                  {job.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Display all job cards but filter based on selected tab */}
          <FlatList
            data={sitterJobs.filter((job) => selectedTab === job.id)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <JobCard job={item} />}
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
  },
  tabContainer: {
    marginTop: 15,
    marginBottom: 10,
    maxHeight: 50,
  },
  tabContentContainer: {
    paddingHorizontal: 15,
    alignItems: "center",
  },
  tabItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  selectedTabItem: {
    backgroundColor: "#FFDD00",
  },
  tabText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
  selectedTabText: {
    color: "#000",
    fontWeight: "bold",
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
  headerText: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  breed: {
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
});

export default JobListingsScreen;
