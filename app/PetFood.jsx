import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import petFoodIcon from '@/assets/images/pet-food.png';
import { apiRequest } from './utils/apiHandler'; // Adjust path as needed

const PetFood = () => {
  const { categoryId, categoryName = 'Pet Food' } = useLocalSearchParams(); // Get categoryId and optional categoryName
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiRequest('POST', 'shop-vendor/product', { category_id: categoryId });
        if (response?.status === 'true' && Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setProducts([]);
          setError('No products found for this category.');
        }
      } catch (err) {
        setError(err.message || 'Unable to load products.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    if (categoryId) {
      fetchProducts();
    } else {
      setError('Invalid category ID.');
      setLoading(false);
    }
  }, [categoryId]);

  const handleRetry = () => {
    fetchProducts();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{categoryName}</Text>
        <Image source={petFoodIcon} style={styles.headerIcon} />
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFDD00" />
            <Text style={styles.loadingText}>Loading products...</Text>
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
        ) : products.length > 0 ? (
          products.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardLeft}>
                <Image
                  source={item.logoImageUrl ? { uri: item.logoImageUrl } : petFoodIcon}
                  style={styles.productImage}
                  defaultSource={petFoodIcon}
                  resizeMode="stretch"
                />
              </View>
              <View style={styles.cardCenter}>
                <Text style={styles.productTitle}>{item.name}</Text>
                <Text style={styles.productPrice}>Rs {item.price}</Text>
                <Text style={styles.productDesc}>{item.description}</Text>
              </View>
              <View style={styles.cardRight}>
                {item.quantity > 0 ? (
                  <View style={styles.qtyBox}>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                  </View>
                ) : (
                  <View style={styles.soldOutBox}>
                    <Text style={styles.soldOutText}>Sold Out</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products available.</Text>
          </View>
        )}
      </View>

      <Text style={styles.paw}>🐾</Text>
    </ScrollView>
  );
};

export default PetFood;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FCFF',
    flex: 1,
  },
  header: {
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
    marginBottom: 10,
    color: '#000',
  },
  headerIcon: {
    width: 50,
    height: 50,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  card: {
    backgroundColor: '#FFF5CC',
    borderRadius: 20,
    flexDirection: 'row',
    padding: 15,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  cardLeft: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cardCenter: {
    flex: 1,
  },
  cardRight: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  productImage: {
    width: 60,
    height: 90,
    borderRadius: 10,
  },
  productTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  productPrice: {
    color: '#000',
    marginBottom: 5,
  },
  productDesc: {
    fontSize: 12,
    color: '#333',
  },
  qtyBox: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  qtyText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  soldOutBox: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  soldOutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  paw: {
    fontSize: 28,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
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
    backgroundColor: '#FFF5CC',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Rockwell',
    color: '#B91C1C', // Red for error
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
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Rockwell',
    color: '#333',
  },
});