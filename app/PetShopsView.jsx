import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import shopIcon from '@/assets/images/store.png';
import { apiRequest } from './utils/apiHandler'; // Adjust path as needed

const PetShopsView = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching shop-vendor data');
        const response = await apiRequest('POST', 'shop-vendor', {});
        console.log('Raw Shop API Response:', JSON.stringify(response, null, 2));

        if (response?.status === 'true' && Array.isArray(response.data)) {
          const formattedShops = response.data.map(item => ({
            id: item.id,
            name: item.shop_name,
            phone: item.phone_number,
            location: item.address,
          }));
          setShops(formattedShops);
          console.log('Formatted Shops set:', formattedShops);
        } else {
          setShops([]);
          setError('Failed to fetch shops: Invalid response format');
          console.log('Invalid shop response:', response);
        }
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch shops';
        setError(errorMessage);
        setShops([]);
        console.error('API Error:', err);
        if (err.response) {
          console.log('Error Response:', err.response);
        } else if (err.request) {
          console.log('No response received from server');
        }
      } finally {
        setLoading(false);
        console.log('Fetch completed. Loading:', false, 'Shops:', shops);
      }
    };

    fetchShops();
  }, []);

  const handleRetry = () => {
    fetchShops();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Store</Text>
        <Image source={shopIcon} style={styles.headerIcon} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFDD00" />
          <Text style={styles.loadingText}>Loading shops...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            onPress={handleRetry}
            style={styles.retryButton}
            activeOpacity={0.7}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.list}>
          {shops.length > 0 ? (
            shops.map((shop) => (
              <View key={shop.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.shopTitle}>{shop.name}</Text>
                    <Text style={styles.phone}>{shop.phone}</Text>
                    <Text style={styles.location}>{shop.location}</Text>
                  </View>
                  <Image source={shopIcon} style={styles.cardIcon} />
                </View>
                <TouchableOpacity style={styles.viewButton}>
                  <Link
                    href={{ pathname: '/ShopView', params: { id: shop.id } }}
                    style={styles.viewButtonLink}
                  >
                    <Text style={styles.viewButtonText}>View</Text>
                  </Link>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No shops available</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerPaw}>🐾</Text>
      </View>
    </ScrollView>
  );
};

export default PetShopsView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FCFF',
  },
  header: {
    backgroundColor: '#FFDD00',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Rockwell',
    color: '#000',
    marginBottom: 10,
  },
  headerIcon: {
    width: 60,
    height: 60,
  },
  list: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 50,
    height: 50,
    marginLeft: 10,
  },
  shopTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Rockwell',
    marginBottom: 4,
  },
  phone: {
    color: '#333',
    fontFamily: 'Rockwell',
    marginBottom: 2,
  },
  location: {
    color: '#555',
    fontFamily: 'Rockwell',
  },
  viewButton: {
    backgroundColor: '#FFDD00',
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    height: 30 
  },
  viewButtonLink: {
    flex: 1,
    alignItems: 'center',
  },
  viewButtonText: {
    fontWeight: 'bold',
    fontFamily: 'Rockwell',
    color: '#000',
  
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerPaw: {
    fontSize: 24,
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
    fontSize: 14,
    color: '#D32F2F',
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FFDD00',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  retryButtonText: {
    fontFamily: 'Rockwell',
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  emptyText: {
    fontFamily: 'Rockwell',
    fontSize: 16,
    color: '#666',
  },
});