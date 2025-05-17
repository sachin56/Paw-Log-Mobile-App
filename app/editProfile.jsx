import { View, Text, ScrollView, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import edit from "@/assets/images/EditPro.png"
import dogcatsmal from "@/assets/images/dogcatsmal.png"
import back from "@/assets/images/back.png"
import { Link } from 'expo-router'

const EditProfile = () => {
  return (
    <ScrollView>
      <View style={styles.menu}>
        <Link href="/index" asChild>
          <TouchableOpacity>
            <Image style={styles.back} source={back} resizeMode="stretch" />
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.editContainer}>
        <Text style={styles.textEdit}>Edit Profile</Text>
        <Image style={styles.edit} source={edit} resizeMode="stretch" />
        <Image style={styles.dogcatsmal} source={dogcatsmal} resizeMode="stretch" />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Address</Text>
        <TextInput style={styles.input} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Number</Text>
        <TextInput style={styles.input} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelBtn}>
          <Text>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn}>
          <Text>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottom} />
    </ScrollView>
  )
}

export default EditProfile

const styles = StyleSheet.create({
  menu: {
    paddingTop: 50,
    paddingLeft: 20,
  },
  back: {
    width: 20,
    height: 20,
  },
  editContainer: {
    alignItems: "center",
    marginTop: 40,
    position: "relative",
  },
  textEdit: {
    fontSize: 30,
    fontFamily: "Rockwell",
    paddingTop: 10,
  },
  edit: {
    width: 80,
    height: 80,
    marginTop: 25,
    marginBottom: 40,
  },
  dogcatsmal: {
    width: 70,
    height: 70,
    position: "absolute",
    right: 20,
    bottom: 10,
  },
  inputContainer: {
    marginBottom: 30,
    marginHorizontal: 40,
  },
  label: {
    color: "#848884",
    fontSize: 15,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 40,
    padding: 10,
    borderBottomColor: "#000000",
    borderBottomWidth: 1,
  },
  buttonContainer: {
    paddingTop: 20,
    marginLeft: 45,
    flexDirection: "row",
  },
  cancelBtn: {
    backgroundColor: "#FFB700",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 56,
    marginRight: 15,
  },
  bottom: {
    marginTop: 60,
    height: 42,
    backgroundColor: "#FFDD00",
    borderRadius: 100,
    alignItems: "flex-end",
  },
})
