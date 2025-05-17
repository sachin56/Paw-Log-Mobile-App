import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Animated,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import back from '@/assets/images/back.png';
import ham from '@/assets/images/ham.png';
import paw from '@/assets/images/paw.png';
import paws from '@/assets/images/paws.png';
import { apiRequest } from './utils/apiHandler';

const { width, height } = Dimensions.get('window');
const inputWidth = Math.min(340, width * 0.9);
const imageSize = Math.min(140, width * 0.35);

const PetProfile = () => {
  const route = useRoute();
  const router = useRouter();
  const { pet } = route.params;

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [medical, setMedical] = useState('');
  const [note, setNotes] = useState('');
  const [logoUrl, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });
  const [statsOpen, setStatsOpen] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [pawAnim] = useState(new Animated.Value(0));
  const [statsAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (pet) {
      setImage(pet.logoUrl || '');
      setName(pet.name || '');
      setAge(pet.age?.toString() || '');
      setBreed(pet.breed || '');
      setGender(pet.gender === 2 ? 'Female' : 'Male');
      setWeight(pet.weight?.toString() || '');
      setMedical(pet.medical_condition || '');
      setNotes(pet.addition_note || '');
    }
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(pawAnim, {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [pet, fadeAnim, pawAnim]);

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    if (['name', 'age', 'breed', 'gender'].includes(field) && !value.trim()) {
      newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    } else {
      delete newErrors[field];
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value, setter) => {
    setter(value);
    validateField(field, value);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleUpdate = async () => {
    const isValid = validateField('name', name) && validateField('age', age) &&
                    validateField('breed', breed) && validateField('gender', gender);
    if (!isValid) {
      setToast({ visible: true, message: 'Please fill all required fields', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        pet_id: pet.id.toString(),
        name,
        age: parseInt(age) || 0,
        breed,
        gender: gender === 'Female' ? 2 : 1,
        weight: parseFloat(weight) || 0,
        medical_condition: medical,
        addition_note: note,
      };
      const response = await apiRequest('POST', 'pet-management/update-pet', payload);
      if (response?.status === 200 || response?.status === true) {
        setToast({ visible: true, message: 'Pet updated successfully!', type: 'success' });
      } else {
        setToast({ visible: true, message: `Update failed: ${response?.message || 'Unknown error'}`, type: 'error' });
      }
    } catch (error) {
      console.error('Update error:', error);
      setToast({ visible: true, message: 'Failed to update pet. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const toggleStats = () => {
    Animated.timing(statsAnim, {
      toValue: statsOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setStatsOpen(!statsOpen);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <LinearGradient
        colors={['#FFDD00', '#FF8C00']}
        style={styles.header}
      >
        <View style={styles.menu}>
          <Link href="/myPets">
            <Image style={styles.icon} source={back} resizeMode="contain" />
          </Link>
          <Image style={styles.icon} source={ham} resizeMode="contain" />
        </View>
        <Animated.View style={[styles.pawLeft, { transform: [{ scale: pawAnim }] }]}>
          <Image source={paws} style={styles.pawIcon} resizeMode="contain" />
        </Animated.View>
        <Animated.View style={[styles.pawRight, { transform: [{ scale: pawAnim }] }]}>
          <Image source={paws} style={styles.pawIcon} resizeMode="contain" />
        </Animated.View>
        <Animated.View style={[styles.petInfo, { opacity: fadeAnim }]}>
          <Text style={styles.petName}>{name || 'My Pet'}</Text>
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
            {logoUrl ? (
              <Image
                style={styles.petImage}
                source={{ uri: logoUrl }}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.petImagePlaceholder}>
                <Text style={styles.placeholderText}>🐾</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>

      <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.statsCard} onPress={toggleStats}>
          <LinearGradient
            colors={['#FFF5CC', '#FFF8E1']}
            style={styles.statsGradient}
          >
            <Text style={styles.statsTitle}>Pet Stats</Text>
            <Animated.View
              style={{
                height: statsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 100],
                }),
                overflow: 'hidden',
              }}
            >
              {statsOpen && (
                <View style={styles.statsContent}>
                  <Text style={styles.statsText}>Age: {age || 'N/A'}</Text>
                  <Text style={styles.statsText}>Breed: {breed || 'N/A'}</Text>
                  <Text style={styles.statsText}>Gender: {gender || 'N/A'}</Text>
                </View>
              )}
            </Animated.View>
          </LinearGradient>
        </TouchableOpacity>

        {[
          { label: 'Name *', value: name, onChange: (v) => handleInputChange('name', v, setName) },
          { label: 'Age *', value: age, onChange: (v) => handleInputChange('age', v, setAge), keyboardType: 'numeric' },
          { label: 'Breed *', value: breed, onChange: (v) => handleInputChange('breed', v, setBreed) },
          { label: 'Gender *', value: gender, onChange: (v) => handleInputChange('gender', v, setGender) },
          { label: 'Weight (kg)', value: weight, onChange: setWeight, keyboardType: 'numeric' },
          { label: 'Medical Conditions', value: medical, onChange: setMedical },
          { label: 'Dietary/Behavioral Notes', value: note, onChange: setNotes, multiline: true },
        ].map((field, index) => (
          <View key={index} style={styles.inputContainer}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={[
                styles.input,
                field.multiline && styles.multilineInput,
                errors[field.label.split(' ')[0].toLowerCase()] && styles.inputError,
              ]}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={field.label.replace(' *', '')}
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              keyboardType={field.keyboardType || 'default'}
              multiline={field.multiline}
              numberOfLines={field.multiline ? 4 : 1}
              editable={!loading}
            />
            {errors[field.label.split(' ')[0].toLowerCase()] && (
              <Text style={styles.errorText}>{errors[field.label.split(' ')[0].toLowerCase()]}</Text>
            )}
          </View>
        ))}

        <View style={styles.buttonContainer}>
          {[
            { text: 'Change Photo', onPress: pickImage },
            { text: 'Vaccination', onPress: () => router.push('/AddVaccination') },
            { text: 'Update', onPress: handleUpdate, showLoading: true },
            { text: 'Fetch E-Book', onPress: () => router.push({ pathname: '/eBook', params: { petId: pet.id.toString() } }) },
          ].map((btn, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.button, (btn.showLoading && loading) && styles.buttonDisabled]}
              activeOpacity={0.7}
              onPress={btn.onPress}
              disabled={btn.showLoading && loading}
            >
              <LinearGradient
                colors={['#FFDD00', '#FF8C00']}
                style={styles.buttonGradient}
              >
                {btn.showLoading && loading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>{btn.text}</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Animated.View style={{ transform: [{ scale: pawAnim }] }}>
            <Image style={styles.pawFooter} source={paw} resizeMode="contain" />
          </Animated.View>
        </View>
      </Animated.View>

      <Modal
        visible={toast.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setToast({ ...toast, visible: false })}
      >
        <View style={styles.toastContainer}>
          <LinearGradient
            colors={toast.type === 'success' ? ['#4CAF50', '#388E3C'] : ['#F44336', '#D32F2F']}
            style={styles.toast}
          >
            <Text style={styles.toastText}>{toast.message}</Text>
            <TouchableOpacity
              onPress={() => setToast({ ...toast, visible: false })}
              style={styles.toastClose}
            >
              <Text style={styles.toastCloseText}>×</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default PetProfile;

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#F9FCFF',
    paddingBottom: 60,
  },
  header: {
    borderBottomLeftRadius: 70,
    borderBottomRightRadius: 70,
    paddingTop: 50,
    paddingBottom: 50,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 25,
    paddingTop: 15,
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: '#333',
  },
  pawLeft: {
    position: 'absolute',
    top: 100,
    left: 40,
  },
  pawRight: {
    position: 'absolute',
    top: 160,
    right: 40,
  },
  pawIcon: {
    width: 50,
    height: 50,
    opacity: 0.85,
  },
  petInfo: {
    alignItems: 'center',
    marginTop: 25,
  },
  petName: {
    fontSize: 30,
    fontFamily: 'Rockwell',
    fontWeight: 'bold',
    color: '#333',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 20,
  },
  petImage: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
    borderWidth: 4,
    borderColor: '#FFF5CC',
    backgroundColor: '#FFF',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  petImagePlaceholder: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
    backgroundColor: 'rgba(255, 245, 204, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFDD00',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  placeholderText: {
    fontSize: 48,
    color: '#333',
  },
  formContainer: {
    paddingHorizontal: 25,
    paddingTop: 40,
  },
  statsCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  statsGradient: {
    padding: 20,
  },
  statsTitle: {
    fontSize: 20,
    fontFamily: 'Rockwell',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  statsContent: {
    paddingTop: 10,
  },
  statsText: {
    fontSize: 16,
    fontFamily: 'Rockwell',
    color: '#333',
    marginBottom: 5,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 17,
    fontFamily: 'Rockwell',
    color: '#333',
    marginBottom: 10,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255, 245, 204, 0.9)',
    borderRadius: 15,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Rockwell',
    color: '#333',
    borderWidth: 1,
    borderColor: 'transparent',
    width: inputWidth,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#F44336',
    shadowColor: '#F44336',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Rockwell',
    color: '#F44336',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  button: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 17,
    fontFamily: 'Rockwell',
    color: '#333',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  pawFooter: {
    width: 48,
    height: 48,
  },
  toastContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  toast: {
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: width * 0.8,
  },
  toastText: {
    fontSize: 16,
    fontFamily: 'Rockwell',
    color: '#FFF',
    flex: 1,
  },
  toastClose: {
    padding: 10,
  },
  toastCloseText: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
  },
});