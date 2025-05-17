import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link, useNavigation } from 'expo-router'

import paw from "@/assets/images/paw.png"
import icon from "@/assets/images/user.png"
import dog from "@/assets/images/dog.png"
import book from "@/assets/images/book.png"
import pet from "@/assets/images/myPet.png"
import location from "@/assets/images/map.png"
import grooming from "@/assets/images/grooming.png"
import book2 from "@/assets/images/book-2.png"
import store from "@/assets/images/store.png"
import sitting from "@/assets/images/sitting.png"

const Index = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={{ backgroundColor: "#f8f8f8" }}>
      <View style={styles.header}>
        <Link href="/editProfile" style={styles.iconWrapper}>
          <Image source={icon} style={styles.icon} />
        </Link>
        <Image style={styles.paw} source={paw} />
        <Text style={styles.greet}>Hello!</Text>
        <Text style={styles.username}>Heshan</Text>
      </View>

      <View style={styles.cardsContainer}>
        {[
          { label: "Add Pet", image: dog, route: "addPet" },
          { label: "Appointment", image: book, route: "Book" },
          { label: "My Pets", image: pet, route: "myPets" },
          { label: "E-Book", image: book2, route: "eBook" },
          { label: "Pet Sitting", image: sitting, route: "" },
          { label: "Stores", image: store, route: "PetShopsView" },
        ].map(({ label, image, route }, i) => (
          <TouchableOpacity key={i} onPress={() => route && navigation.navigate(route)} style={styles.card}>
            <Image source={image} style={styles.cardImage} />
            <Text style={styles.cardText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

export default Index

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FFDD00",
    borderBottomLeftRadius: 130,
    borderBottomRightRadius: 130,
    paddingTop: 80,
    paddingBottom: 140,
    paddingHorizontal: 20,
    position: "relative",
    justifyContent:"center",
    alignItems:"center"
  },
  iconWrapper: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  icon: {
    width: 32,
    height: 32,
  },
  paw: {
    position: "absolute",
    top: 40,
    left: 20,
    width: 30,
    height: 30,
  },
  greet: {
    fontSize: 32,
    color: "#030303",
    fontWeight: "600",
    fontFamily: "System",
    marginTop: 20,
    alignItems:"center",
    justifyContent:"center"
  },
  username: {
    fontSize: 20,
    color: "#000",
    fontFamily: "System",
    marginTop: 6,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
    paddingVertical: 30,
    paddingHorizontal: 16,
  },
  card: {
    width: 140,
    height: 140,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
    margin: 10,
  },
  cardImage: {
    width: 36,
    height: 36,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "System",
  },
})
