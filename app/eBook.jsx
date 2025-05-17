import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

import back from '@/assets/images/back.png';
import ham from '@/assets/images/ham.png';
import paws from '@/assets/images/paws.png';
import pawsTwo from '@/assets/images/paws.png';
import { apiRequest } from './utils/apiHandler';

const eBook = () => {
  const { petId } = useLocalSearchParams();
  const [petData, setPetData] = useState(null);
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEbookDetails = async () => {
      try {
        const payload = { pet_id: petId };
        console.log('Request payload:', payload);

        const response = await apiRequest('post', 'e-book', payload);
        console.log('Full API response:', JSON.stringify(response, null, 2));

        if (response?.status === 200 || response?.status === 'true') {
          const { pet, ebooks } = response.data;
          setPetData(pet);
          setEbooks(ebooks || []);
          console.log('Pet:', pet);
          console.log('eBooks:', JSON.stringify(ebooks, null, 2));
        } else {
          alert(response?.message || 'Failed to load e-book data.');
        }
      } catch (error) {
        console.error('Error fetching e-book:', error);
        alert('Error fetching e-book details.');
      } finally {
        setLoading(false);
      }
    };

    if (petId) {
      fetchEbookDetails();
    }
  }, [petId]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.menu}>
          <Image style={styles.back} source={back} resizeMode="stretch" />
          <Image style={styles.ham} source={ham} resizeMode="stretch" />
        </View>

        <Image style={styles.paws} source={paws} resizeMode="stretch" />
        <Image style={styles.pawsTwo} source={pawsTwo} resizeMode="stretch" />

        <View style={styles.details}>
          <Text style={styles.textEdit}>E-Book</Text>
          {petData?.logoUrl ? (
            <Image
              style={styles.petImage}
              source={{ uri: petData.logoUrl }}
              resizeMode="cover"
              onError={() => console.log('Failed to load pet image')}
            />
          ) : null}
          <Text style={styles.textEditTwo}>{petData?.name || 'Unnamed'}</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFDD00" style={{ marginTop: 50 }} />
      ) : ebooks.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 50 }}>
          No e-books available.
        </Text>
      ) : (
        ebooks.map((item) => (
          <View key={item.id} style={styles.cardContainer}>
            <Text style={styles.vac}>{item.title}</Text>
            <Text style={styles.des} numberOfLines={3} ellipsizeMode="tail">
              {item.description}
            </Text>
            {item.attachmentUrl ? (
              <TouchableOpacity
                style={styles.viewBtn}
                onPress={() => Linking.openURL(item.attachmentUrl)}
              >
                <Text style={{ fontWeight: 'bold', color: '#000' }}>View Attachment</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default eBook;
const styles = StyleSheet.create({
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  back: {
    width: 20,
    height: 20,
    marginTop: 10,
    marginLeft: 20,
  },
  ham: {
    width: 20,
    height: 20,
    marginTop: 10,
    marginRight: 20,
  },
  container: {
    alignItems: 'flex-start',
    backgroundColor: '#FFDD00',
    borderBottomLeftRadius: 70,
    borderBottomRightRadius: 70,
    paddingTop: 50,
    paddingBottom: 80,
  },
  textEdit: {
    fontSize: 20,
    fontFamily: 'Rockwell',
    paddingTop: 40,
    paddingBottom: 20,
    fontWeight: 'bold',
  },
  textEditTwo: {
    fontSize: 20,
    fontFamily: 'Rockwell',
    paddingTop: 20,
  },
  petImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  details: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  paws: {
    height: 50,
    width: 50,
    position: 'absolute',
    top: 90,
    left: 50,
  },
  pawsTwo: {
    height: 50,
    width: 50,
    position: 'absolute',
    top: 200,
    left: 300,
  },
  cardContainer: {
    marginTop: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingTop: 25,
    paddingBottom: 35,
    marginHorizontal: 20,
    shadowColor: '#00000040',
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
  },
  vac: {
    fontFamily: 'Rockwell',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  des: {
    color: '#000000',
    fontSize: 13,
    marginBottom: 20,
    paddingHorizontal: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  viewBtn: {
    backgroundColor: '#FFDD00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
});