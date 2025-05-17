import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from 'expo-router';
import back from '@/assets/images/back.png';
import ham from '@/assets/images/ham.png';
import edit from '@/assets/images/EditPro.png';
import DocLogo from '@/assets/images/DocLogo.png';
import lady from '@/assets/images/lady.png';
import men from '@/assets/images/men.png';
import { apiRequest } from './utils/apiHandler'; // Adjust path as needed

const Book = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiRequest('POST', 'veterinarian');
        console.log('API Response:', JSON.stringify(response, null, 2));

        if (response?.status === 'true' && Array.isArray(response.data)) {
          setData(response.data);
        } else {
          setData([]);
          setError('Invalid data format from server');
        }
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch veterinarians';
        if (err.response) {
          setError(`Server error: ${err.response.status} - ${err.response.data?.message || errorMessage}`);
        } else if (err.request) {
          setError('Network error: No response from server');
        } else {
          setError(errorMessage);
        }
        console.error('API Error Details:', err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      setError(null);
      const response = await apiRequest('POST', 'veterinarian');
      if (response?.status === 'true' && Array.isArray(response.data)) {
        setData(response.data);
      } else {
        setData([]);
        setError('Invalid data format from server');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch veterinarians';
      if (err.response) {
        setError(`Server error: ${err.response.status} - ${err.response.data?.message || errorMessage}`);
      } else if (err.request) {
        setError('Network error: No response from server');
      } else {
        setError(errorMessage);
      }
      console.error('API Error Details:', err);
      setData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      style={styles.scrollView}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#FFD700']}
          tintColor="#FFD700"
        />
      }
    >
      <View style={styles.header}>
        <View style={styles.menu}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={styles.iconButton}
          >
            <Image style={styles.back} source={back} resizeMode="contain" />
          </TouchableOpacity>
          
        </View>
        <View style={styles.user}>
          <Image style={styles.edit} source={edit} resizeMode="cover" />
          <View style={styles.text}>
            <Text style={styles.h1}>Book an Appointment</Text>
            <Text style={styles.h2}>John Carter</Text>
          </View>
        </View>
      </View>

      <View style={styles.box}>
        <Text style={styles.h3}>Looking for a Vet for Your Pet?</Text>
        <Image style={styles.logo} source={DocLogo} resizeMode="contain" />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Loading veterinarians...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            onPress={handleRefresh}
            style={styles.retryButton}
            activeOpacity={0.7}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : data.length === 0 ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No veterinarians available</Text>
        </View>
      ) : (
        data.map((item, index) => (
          <View key={item.id} style={styles.cardMain}>
            <View style={styles.card}>
              <View style={styles.innerCard}>
                <Image
                  style={styles.avatar}
                  source={index % 2 === 0 ? lady : men}
                  resizeMode="cover"
                />
                <View style={styles.texts}>
                  <Text style={styles.h4}>Dr. {item.name}</Text>
                  <Text style={styles.h5}>{item.clincName}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('Appointment', { doctorId: item.id, doctorName: item.name })}
                style={styles.bookBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.booktext}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default Book;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFD700',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 40,
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
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 30,
    marginTop: 20,
  },
  edit: {
    height: 70,
    width: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#FFF',
    marginRight: 15,
  },
  text: {
    flexDirection: 'column',
  },
  h1: {
    fontFamily: 'Rockwell',
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  h2: {
    fontFamily: 'Rockwell',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FCFF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    marginTop:30,
    marginBottom: 50,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  h3: {
    fontFamily: 'Rockwell',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    width: 200,
    letterSpacing: 0.5,
    lineHeight: 28,
  },
  logo: {
    height: 60,
    width: 60,
  },
  cardMain: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 6,
  },
  innerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    height: 80,
    width: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#FFD700',
    marginRight: 15,
  },
  texts: {
    flexDirection: 'column',
  },
  h4: {
    fontFamily: 'Rockwell',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  h5: {
    fontFamily: 'Rockwell',
    fontSize: 14,
    color: '#666',
    letterSpacing: 0.5,
  },
  bookBtn: {
    backgroundColor: '#FFB700',
    borderRadius: 25,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: 'center',
  },
  booktext: {
    fontFamily: 'Rockwell',
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: 'bold',
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
  errorText: {
    fontFamily: 'Rockwell',
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 22,
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