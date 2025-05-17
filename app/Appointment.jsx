import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import back from '@/assets/images/back.png';
import ham from '@/assets/images/ham.png';
import { apiRequest } from './utils/apiHandler'; // Adjust path as needed

export default function Appointment() {
  const { doctorId, doctorName: initialDoctorName = '' } = useLocalSearchParams();
  const [doctorName, setDoctorName] = useState(initialDoctorName);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedPetId, setSelectedPetId] = useState('');
  const [times, setTimes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [pets, setPets] = useState([]);
  const [timesData, setTimesData] = useState([]);
  const [locationsData, setLocationsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(doctorId ? null : 'No doctor selected');
  const [submissionError, setSubmissionError] = useState(null);
  const navigation = useNavigation();

  console.log('Appointment Component Mounted - doctorId:', doctorId, 'doctorName:', initialDoctorName);

  useEffect(() => {
    if (!doctorId) {
      setApiError('No doctor selected. Please select a veterinarian.');
      console.log('No doctorId provided. Skipping API calls.');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setApiError(null);
        console.log('Fetching data for doctorId:', doctorId);

        // Fetch times
        const timeResponse = await apiRequest('POST', 'veterinarian/time', { doctorId });
        console.log('Raw Time API Response:', JSON.stringify(timeResponse, null, 2));
        if (timeResponse?.status === 'true' && Array.isArray(timeResponse.data)) {
          const formattedTimes = timeResponse.data
            .filter(item => item.status === 'Y')
            .map(item => ({
              id: item.id,
              time: new Date(item.time).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              }),
            }));
          setTimes(formattedTimes.map(item => item.time));
          setTimesData(formattedTimes);
          console.log('Formatted Times set:', formattedTimes);
        } else {
          setTimes([]);
          setTimesData([]);
          setApiError('Failed to fetch available times: Invalid response format');
          console.log('Invalid time response:', timeResponse);
        }

        // Fetch locations
        const locationResponse = await apiRequest('POST', 'veterinarian/location', { doctorId });
        console.log('Raw Location API Response:', JSON.stringify(locationResponse, null, 2));
        if (locationResponse?.status === 'true' && Array.isArray(locationResponse.data)) {
          const formattedLocations = locationResponse.data
            .filter(item => item.status === 'Y')
            .map(item => ({
              id: item.id,
              location: item.location,
            }));
          setLocations(formattedLocations.map(item => item.location));
          setLocationsData(formattedLocations);
          console.log('Formatted Locations set:', formattedLocations);
        } else {
          setLocations([]);
          setLocationsData([]);
          setApiError('Failed to fetch available locations: Invalid response format');
          console.log('Invalid location response:', locationResponse);
        }

        // Fetch pets
        const petResponse = await apiRequest('POST', 'pet-management/get-all-pet', {});
        console.log('Raw Pet API Response:', JSON.stringify(petResponse, null, 2));
        if (petResponse?.status === 'true' && Array.isArray(petResponse.data)) {
          const formattedPets = petResponse.data.map(item => ({
            id: item.id,
            name: item.name,
          }));
          setPets(formattedPets);
          console.log('Formatted Pets set:', formattedPets);
        } else {
          setPets([]);
          setApiError('Failed to fetch pets: Invalid response format');
          console.log('Invalid pet response:', petResponse);
        }
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch data';
        setApiError(errorMessage);
        setTimes([]);
        setLocations([]);
        setPets([]);
        setTimesData([]);
        setLocationsData([]);
        console.error('API Error:', err);
        if (err.response) {
          console.log('Error Response:', err.response);
        } else if (err.request) {
          console.log('No response received from server');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId]);

  useEffect(() => {
    console.log('State Updated - Times:', times, 'Locations:', locations, 'Pets:', pets);
  }, [times, locations, pets]);

  const validateForm = () => {
    const newErrors = {};
    if (!doctorName.trim()) newErrors.doctorName = 'Doctor’s name is required';
    if (!selectedTime) newErrors.selectedTime = 'Please select a time';
    if (!selectedLocation) newErrors.selectedLocation = 'Please select a location';
    if (!selectedPetId) newErrors.selectedPetId = 'Please select a pet';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const selectedPetName = pets.find(pet => pet.id === selectedPetId)?.name || '';
    const timeId = timesData.find(item => item.time === selectedTime)?.id;
    const locationId = locationsData.find(item => item.location === selectedLocation)?.id;

    if (!timeId || !locationId) {
      setSubmissionError('Invalid time or location selected. Please try again.');
      return;
    }

    Alert.alert(
      'Confirm Appointment',
      `Doctor: ${doctorName}\nPet: ${selectedPetName}\nTime: ${selectedTime}\nLocation: ${selectedLocation}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Proceed',
          onPress: async () => {
            try {
              setSubmissionError(null);
              const body = {
                vetid: doctorId,
                appoimentTime: timeId.toString(),
                appoimentLocation: locationId.toString(),
                petId: selectedPetId.toString(),
              };
              console.log('Submitting to appointment/store:', JSON.stringify(body, null, 2));
              const response = await apiRequest('POST', 'appointment/store', body);
              console.log('Appointment Store Response:', JSON.stringify(response, null, 2));

              if (response?.status === 'true') {
                navigation.navigate('Payment', {
                  doctorId,
                  doctorName,
                  petId: selectedPetId,
                  petName: selectedPetName,
                  time: selectedTime,
                  location: selectedLocation,
                  appointmentId: response.data?.id || null,
                });
              } else {
                setSubmissionError(response?.message || 'Failed to create appointment');
              }
            } catch (err) {
              const errorMessage = err.message || 'Failed to create appointment';
              setSubmissionError(errorMessage);
              console.error('Submission Error:', err);
              if (err.response) {
                console.log('Error Response:', err.response);
              }
            }
          },
        },
      ]
    );
  };

  const handleRetry = () => {
    if (!doctorId) {
      navigation.navigate('Book');
    } else {
      fetchData();
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.header}>
        <View style={styles.menu}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Book')}
            activeOpacity={0.7}
            style={styles.iconButton}
          >
            <Image style={styles.back} source={back} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => console.log('Hamburger pressed')}
            activeOpacity={0.7}
            style={styles.iconButton}
          >
            <Image style={styles.ham} source={ham} resizeMode="contain" />
          </TouchableOpacity>
        </View>
        <View style={styles.name}>
          <Text style={styles.textEdit}>Book an Appointment</Text>
        </View>
      </View>

      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.loadingText}>Loading appointment options...</Text>
          </View>
        ) : apiError || submissionError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{apiError || submissionError}</Text>
            <TouchableOpacity
              onPress={apiError ? handleRetry : handleSubmit}
              style={styles.retryButton}
              activeOpacity={0.7}
            >
              <Text style={styles.retryButtonText}>
                {apiError && !doctorId ? 'Select a Doctor' : 'Try Again'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.label}>Doctor's Name</Text>
            <TextInput
              style={[styles.input, errors.doctorName && styles.inputError]}
              placeholder="Enter Doctor's Name"
              placeholderTextColor="#999"
              value={doctorName}
              onChangeText={setDoctorName}
            />
            {errors.doctorName && <Text style={styles.errorText}>{errors.doctorName}</Text>}

            <Text style={styles.label}>Select Pet</Text>
            <View style={[styles.pickerContainer, errors.selectedPetId && styles.inputError]}>
              <Picker
                selectedValue={selectedPetId}
                onValueChange={(itemValue) => {
                  console.log('Selected Pet ID:', itemValue);
                  setSelectedPetId(itemValue);
                }}
                style={styles.picker}
                enabled={!loading}
              >
                <Picker.Item label="Select a pet" value="" />
                {pets.length > 0 ? (
                  pets.map((pet) => (
                    <Picker.Item key={pet.id} label={pet.name} value={pet.id} />
                  ))
                ) : (
                  <Picker.Item label="No pets available" value="" />
                )}
              </Picker>
            </View>
            {errors.selectedPetId && <Text style={styles.errorText}>{errors.selectedPetId}</Text>}

            <Text style={styles.label}>Select Appointment Time</Text>
            <View style={[styles.pickerContainer, errors.selectedTime && styles.inputError]}>
              <Picker
                selectedValue={selectedTime}
                onValueChange={(itemValue) => {
                  console.log('Selected Time:', itemValue);
                  setSelectedTime(itemValue);
                }}
                style={styles.picker}
                enabled={!loading}
              >
                <Picker.Item label="Select a time" value="" />
                {times.length > 0 ? (
                  times.map((time) => (
                    <Picker.Item key={time} label={time} value={time} />
                  ))
                ) : (
                  <Picker.Item label="No times available" value="" />
                )}
              </Picker>
            </View>
            {errors.selectedTime && <Text style={styles.errorText}>{errors.selectedTime}</Text>}

            <Text style={styles.label}>Select Location in Colombo</Text>
            <View style={[styles.pickerContainer, errors.selectedLocation && styles.inputError]}>
              <Picker
                selectedValue={selectedLocation}
                onValueChange={(itemValue) => {
                  console.log('Selected Location:', itemValue);
                  setSelectedLocation(itemValue);
                }}
                style={styles.picker}
                enabled={!loading}
              >
                <Picker.Item label="Select a location" value="" />
                {locations.length > 0 ? (
                  locations.map((location) => (
                    <Picker.Item key={location} label={location} value={location} />
                  ))
                ) : (
                  <Picker.Item label="No locations available" value="" />
                )}
              </Picker>
            </View>
            {errors.selectedLocation && (
              <Text style={styles.errorText}>{errors.selectedLocation}</Text>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Book Appointment</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFD700',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 30,
    paddingTop: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  iconButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  back: {
    width: 24,
    height: 24,
  },
  ham: {
    width: 24,
    height: 24,
  },
  name: {
    marginTop: 20,
  },
  textEdit: {
    fontFamily: 'Rockwell',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  container: {
    padding: 20,
    backgroundColor: '#F8F9FA',
    marginTop: 20,
  },
  label: {
    fontFamily: 'Rockwell',
    fontSize: 18,
    color: '#1A1A1A',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    fontFamily: 'Rockwell',
    fontSize: 16,
    color: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  pickerContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 15,
    height: 50,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  picker: {
    fontSize: 16,
    color: '#1A1A1A',
    height: 50,
  },
  button: {
    backgroundColor: '#FFB700',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontFamily: 'Rockwell',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
  errorText: {
    fontFamily: 'Rockwell',
    fontSize: 14,
    color: '#D32F2F',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  loadingText: {
    fontFamily: 'Rockwell',
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    letterSpacing: 0.5,
  },
  errorContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  retryButton: {
    backgroundColor: '#FFB700',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  retryButtonText: {
    fontFamily: 'Rockwell',
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});