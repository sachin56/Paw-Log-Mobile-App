import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const Payment = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePayment = () => {
    Alert.alert(
      "Payment Successful",
      `Card Holder: ${cardHolder}\nCard: **** **** **** ${cardNumber.slice(-4)}`
    );
  };

 

  return (
    <ScrollView contentContainerStyle={styles.container}>
        
      <Text style={styles.label}>Card Number</Text>
      <TextInput
        style={styles.input}
        placeholder="1234 5678 9012 3456"
        keyboardType="number-pad"
        maxLength={16}
        value={cardNumber}
        onChangeText={setCardNumber}
      />

      <Text style={styles.label}>Card Holder Name</Text>
      <TextInput
        style={styles.input}
        placeholder="John Doe"
        value={cardHolder}
        onChangeText={setCardHolder}
      />

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Expiry Month</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={expiryMonth}
              onValueChange={setExpiryMonth}
            >
              <Picker.Item label="Month" value="" />
              {Array.from({ length: 12 }, (_, i) => {
                const month = (i + 1).toString().padStart(2, '0');
                return <Picker.Item key={month} label={month} value={month} />;
              })}
            </Picker>
          </View>
        </View>

        <View style={styles.column}>
          <Text style={styles.label}>Expiry Year</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={expiryYear}
              onValueChange={setExpiryYear}
            >
              <Picker.Item label="Year" value="" />
              {Array.from({ length: 10 }, (_, i) => {
                const year = (new Date().getFullYear() + i).toString();
                return <Picker.Item key={year} label={year} value={year} />;
              })}
            </Picker>
          </View>
        </View>
      </View>

      <Text style={styles.label}>CVV</Text>
      <TextInput
        style={styles.input}
        placeholder="123"
        keyboardType="number-pad"
        maxLength={4}
        secureTextEntry
        value={cvv}
        onChangeText={setCvv}
      />

      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>Pay Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Payment;


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    paddingTop:100
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  column: {
    flex: 0.48
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden'
  },
  button: {
      backgroundColor: '#FFB700',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00000'
  }
});