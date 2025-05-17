import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView,
  TextInput, TouchableOpacity, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Link } from 'expo-router';
import { apiRequest } from './utils/apiHandler'; // assume this is your axios wrapper
import addPetImage from '@/assets/images/addPetImage.png';
import back from '@/assets/images/back.png';
import ham from '@/assets/images/ham.png';
import paw from '@/assets/images/paw.png';

const AddPet = () => {
  const [form, setForm] = useState({
    name: '',
    age: '',
    breed: '',
    gender: '',
    weight: '',
    medical_condition: '',
    addition_note: '',
  });

  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Camera roll access is needed.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleInputChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
  const formData = new FormData();

  Object.entries(form).forEach(([key, value]) => {
    formData.append(key, value);
  });

  if (image) {
    formData.append('image', {
      uri: image,
      name: 'pet.jpg',
      type: 'image/jpeg',
    });
  }

  try {
    const response = await apiRequest('post', 'pet-management/register', formData);
    Alert.alert('Success', 'Pet registered successfully!');
  } catch (err) {
    Alert.alert('Error', JSON.stringify(err.response?.data?.errors || err.message));
  }
};


  return (
    <ScrollView style={{ backgroundColor: "#fdfdfd" }}>
      <View style={styles.header}>
        <View style={styles.menu}>
          <Link href="Home"><Image source={back} style={styles.icon} /></Link>
        </View>
        <Text style={styles.title}>Add Pet</Text>
        <Image source={addPetImage} style={styles.headerImage} />
      </View>

      <View style={styles.form}>
        {[
          { label: "Name", key: "name" },
          { label: "Age", key: "age" },
          { label: "Breed", key: "breed" },
          { label: "Gender", key: "gender" },
          { label: "Weight", key: "weight" },
          { label: "Medical Condition", key: "medical_condition" },
          { label: "Notes", key: "addition_note" },
        ].map(({ label, key }, i) => (
          <View key={i} style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              style={styles.input}
              placeholder={`Enter ${label}`}
              placeholderTextColor="#aaa"
              value={form[key]}
              onChangeText={(value) => handleInputChange(key, value)}
            />
          </View>
        ))}

        <TouchableOpacity onPress={pickImage} style={styles.uploadBtn}>
          <Text style={styles.uploadBtnText}>{image ? "Change Image" : "Upload Image"}</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.previewImage} />}

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.buttonCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonAdd} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Image source={paw} style={styles.paw} />
        </View>
      </View>
    </ScrollView>
  );
};

export default AddPet;


const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFDD00',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    position: 'relative',
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    position: 'absolute',
    top: 20,
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    fontFamily: 'System',
    marginTop: 40,
    color: '#000',
  },
  headerImage: {
    width: 120,
    height: 110,
    marginTop: 10,
  },
  form: {
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 60,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 15,
    color: '#555',
    marginBottom: 6,
    fontFamily: 'System',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 4,
    fontSize: 16,
    color: '#000',
    fontFamily: 'System',
  },
  uploadButton: {
    backgroundColor: '#FFD700',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 20,
  },
  buttonCancel: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    flex: 1,
    alignItems: 'center',
  },
  buttonAdd: {
    backgroundColor: '#FFB700',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  footer: {
    marginTop: 50,
    alignItems: 'center',
  },
  paw: {
    width: 30,
    height: 30,
    opacity: 0.6,
  },
});
