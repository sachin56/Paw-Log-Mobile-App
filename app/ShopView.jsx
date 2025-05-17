import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import storeIcon from '@/assets/images/store.png';
import { apiRequest } from './utils/apiHandler'; // Adjust path as needed

const ShopDetails = () => {
  const { id: shopId } = useLocalSearchParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!shopId) {
          throw new Error('Invalid store ID.');
        }
        const response = await apiRequest('POST', 'shop-vendor/categories', { shop_id: shopId });
        if (response?.status === 'true' && Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          setCategories([]);
          setError('No categories found for this store.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load categories. Please try again.');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [shopId]);

  const handleRetry = () => {
    fetchCategories();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pet Shops</Text>
        <Image source={storeIcon} style={styles.headerIcon} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFDD00" />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            onPress={handleRetry}
            style={styles.retryButton}
            activeOpacity={0.7}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : categories.length > 0 ? (
        <View style={styles.grid}>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={{
                pathname: '/PetFood',
                params: { shopId, categoryId: category.id },
              }}
              accessibilityLabel={`View ${category.name} category`}
            >
              <View style={styles.card}>
                {category.logoImageUrl ? (
                  <Image
                    source={{ uri: category.logoImageUrl }}
                    style={styles.cardIcon}
                    defaultSource={storeIcon}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={[styles.cardIcon, { backgroundColor: '#FFF5CC', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ fontSize: 24, color: '#333' }}>🐾</Text>
                  </View>
                )}
                <Text style={styles.cardLabel} numberOfLines={2} ellipsizeMode="tail">
                  {category.name}
                </Text>
              </View>
            </Link>
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No categories available.</Text>
        </View>
      )}

      <Text style={styles.paw}>🐾</Text>
    </ScrollView>
  );
};

export default ShopDetails;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
    backgroundColor: '#F9FCFF',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    backgroundColor: '#FFDD00',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'Rockwell',
    color: '#000',
    marginBottom: 10,
  },
  headerIcon: {
    width: 50,
    height: 50,
  },
  grid: {
    marginTop: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  card: {
    paddingTop: 10,
    backgroundColor: '#FFF5CC',
    borderRadius: 20,
    width: 140,
    height: 140,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 5,
  },
  cardIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  paw: {
    fontSize: 28,
    marginTop: 30,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Rockwell',
    color: '#333',
    marginTop: 10,
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
    marginHorizontal: 20,
    backgroundColor: '#FFF5CC',
    padding: 20,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 5,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Rockwell',
    color: '#B91C1C',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#FFDD00',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Rockwell',
    color: '#333',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Rockwell',
    color: '#333',
  },
});