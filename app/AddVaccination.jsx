import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, Alert, Button } from 'react-native'
import React, { useState } from 'react'
import back from "@/assets/images/back.png"
import ham from "@/assets/images/ham.png"
import paw from "@/assets/images/paw.png"
import mypet from "@/assets/images/myPet.png"
import paws from "@/assets/images/paws.png"
import pawsTwo from "@/assets/images/paws.png"
import file from "@/assets/images/file.png"
import { Link } from 'expo-router'
import * as DocumentPicker from 'expo-document-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';



const AddVaccination = () => {

  const [name, setName] = useState('');
  const [dateReceived, setDateReceived] = useState(new Date());
  const [nextVaccineDate, setNextVaccineDate] = useState(new Date());
  const [document, setDocument] = useState(null);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isNextPickerVisible, setNextPickerVisibility] = useState(false);

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (res.type === 'success') {
        setDocument(res);
      }
    } catch (err) {
      console.error('Document pick error:', err);
    }
  };

  const handleAdd = () => {
    Alert.alert('Success', 'Vaccine information added successfully!');
  };

  const handleCancel = () => {
    setName('');
    setDateReceived(new Date());
    setNextVaccineDate(new Date());
    setDocument(null);
  };

 
  return (
   <ScrollView>
    <View style={styles.containerTop}>
  <View style={styles.menu}> 
                <Link href="/PetProfile" style={styles.back}><Image style={styles.back} source={back} resizeMode={"stretch"} /></Link>
                <Image style={styles.ham} source={ham} resizeMode={"stretch"} />
                </View>
                <View style={styles.details}>
                <Text style={styles.textEditTitle}>Add Vaccination</Text>
             <Image style={styles.addPetImage} source={mypet} resizeMode={"stretch"} />
             <Text style={styles.textEdit}>Rambo</Text>
                </View>
    
             <Image style={styles.paws} source={paws} resizeMode={"stretch"} />
             <Image style={styles.pawsTwo} source={pawsTwo} resizeMode={"stretch"} />
     </View>
  

   <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter name"
      />

      <Text style={styles.label}>Date Received:</Text>
      <TouchableOpacity
        onPress={() => setDatePickerVisibility(true)}
        style={styles.dateButton}
      >
        <Text>{dateReceived.toDateString()}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={(date) => {
          setDateReceived(date);
          setDatePickerVisibility(false);
        }}
        onCancel={() => setDatePickerVisibility(false)}
      />

      <Text style={styles.label}>Next Vaccine Date:</Text>
      <TouchableOpacity
        onPress={() => setNextPickerVisibility(true)}
        style={styles.dateButton}
      >
        <Text>{nextVaccineDate.toDateString()}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isNextPickerVisible}
        mode="date"
        onConfirm={(date) => {
          setNextVaccineDate(date);
          setNextPickerVisibility(false);
        }}
        onCancel={() => setNextPickerVisibility(false)}
      />

      <Text style={styles.label}>Upload Document:</Text>
      <Button title="Choose File" onPress={pickDocument} />
      {document && <Text style={styles.filename}>Selected: {document.name}</Text>}

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={handleCancel} style={[styles.button, styles.cancel]}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAdd} style={[styles.button, styles.add]}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>

   </ScrollView>
  )
}

export default AddVaccination

const styles = StyleSheet.create({



    menu:{
        flex:1,
        flexDirection:"row",
        justifyContent:"space-between"
        
        
    },
    back:{
        width:20,
        height:20,
        marginTop:10,
        marginLeft:20,

        
    },
    ham:{
        width:20,
        height:20,
        marginTop:10,
        marginLeft:340,
    },

    containerTop:{
        alignItems: "flex-start",
        backgroundColor: "#FFDD00",
        paddingTop: 50,
        margin:0,
        paddingBottom: 20,
        alignItems:"center"

    
      },

      details:{
            flex:1,
            flexDirection:"column",
            justifyContent:"center",
            alignItems:"center",
            paddingTop:40,

           },
      textEditTitle:{
        fontSize: 20,
        fontFamily:"Rockwell",
        paddingTop:10,
        marginBottom:10,
      },
      
      textEdit:{
        fontSize: 20,
        fontFamily:"Rockwell",
        paddingTop:10
      },
        addPetImage:{
        padding:5,
        width:90,
        height:90,
      },

      paws:{
        height:50,
        width:50,
        position:"absolute",
        top:90,
        left:40
      },
      pawsTwo:{
        height:50,
        width:50,
        position:"absolute",
        top:200,
        left:300
      },

      nameContainer:{
        marginTop:40,
        marginBottom:30,

    },
    nameText:{
        marginLeft:40,
        color: "#848884",
        fontSize: 15,
        // marginBottom: 5,
    },

           pawConatiner:{
            flex:1,
            alignItems:"center",
            paddingTop:40,
            paddingBottom:40,
           },

           pawImg:{
         
            height:30,
            width:30,
           },
           inputDate:{

            marginLeft:40,
            width: 305,
            height:60,
            padding:10,
            borderBottomColor:"#000000",
            borderWidth:1
           },
           inputVac:{
            marginTop:40,
            borderWidth:1,
            borderStyle:"dotted",
            marginLeft:50,
            width: 305,
            height:200,
            padding:10,
            backgroundColor:"#FFFDD0"
           },
           file:{
            height:40,
            width:40,
            position:"absolute",
            top:150,
            left:190,

           },
           container: {
    padding: 20,
    marginTop: 40,
  },
  label: {
    marginVertical: 8,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 8,
    borderRadius: 4,
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginVertical: 5,
  },
  filename: {
    marginTop: 10,
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancel: {
    backgroundColor: '#ccc',
  },
  add: {
    backgroundColor: '#FFB700',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
           
})