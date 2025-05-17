import { View, Text, ScrollView, StyleSheet,Image, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context'
import back from "@/assets/images/back.png"
import ham from "@/assets/images/ham.png"
import my from "@/assets/images/my.png"
import paws from "@/assets/images/paws.png"
import myPet from "@/assets/images/myPet.png"
import { useNavigation } from 'expo-router'

import { apiRequest } from "./utils/apiHandler"; 

const myPets = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("post", "pet-management/get-all-pet");
        console.log("API Response:", response.data);  // Log response to debug

        // Ensure data is an array and append it to existing data
        if (Array.isArray(response.data)) {
          setData((prevData) => [...prevData, ...response.data]);  // Append new data
        } else {
          setData([]);  // In case the response isn't an array, reset it to an empty array
        }
      } catch (err) {
        setError("Failed to fetch data");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchData(); // Call the fetchData function to refresh
        setRefreshing(false);
    };

    const navigation = useNavigation();
  return (
        <ScrollView>
            <View style={styles.backGround}>
               <View style={styles.menu}> 
                   <Image style={styles.back} source={back} resizeMode={"stretch"} />
                   <Image style={styles.ham} source={ham} resizeMode={"stretch"} />
                   </View>
                   <Text style={styles.header}>My Pets</Text>
                   <Image  style={styles.my} source={my} resizeMode={"stretch"} />
                   <Image style={styles.paws} source={paws} resizeMode={"stretch"} />
                   <Image style={styles.pawsTwo} source={paws} resizeMode={"stretch"} />
                   <Image style={styles.pawsThree} source={paws} resizeMode={"stretch"} />
            </View>
            <View style={styles.mainPic}>
            {Array.isArray(data) && data.map((item, index) => (
                <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate('PetProfile', { pet: item })}
                >
                <View style={styles.rowPic}>
                    <Image
                    style={styles.pic}
                    source={{ uri: item.logoUrl }}
                    resizeMode={"stretch"}
                    />
                    <Text style={styles.name}>{item.name}</Text>
                </View>
                </TouchableOpacity>
            ))}
            </View>

 
        </ScrollView>
 
  )
}

export default myPets

const styles = StyleSheet.create({

    backGround: {
        alignItems: "flex-start",
        backgroundColor: "#FFDD00",
        paddingVertical: 25,
        borderBottomLeftRadius:70,
        borderBottomRightRadius:70,
        height:500,
        margin:0,
        paddingBottom: 80,
        alignItems:"center"
    },

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
    header:{
        color:"#000000",
        fontFamily:"Rockwell",
        fontSize:30,
        marginBottom:310,
      
    },
    my:{
        width: 304,
        height: 304,
        position:"absolute",
        bottom:-19,
    
    },
    paws:{
        height:50,
        width:50,
        position:"absolute",
        top:200,
        right:10

    },pawsTwo:{
        height:50,
        width:50,
        position:"absolute",
        top:70,
        left:10
    }
    ,pawsThree:{
        height:50,
        width:50,
        position:"absolute",
        top:300,
        left:10
    },
    mainPic:{
        flex:1,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        flexWrap:"wrap",
        padding:20,
        gap:20,

    },

    rowPic:{
        flex:1,
        alignItems:"center",
    },
    pic:{
        height:90,
        width:95,
        borderWidth:2,
        borderColor:"#FFB700",
        borderRadius:100,
        padding:10
    
    },
    name:{
        paddingTop:20,
        marginLeft:10,
        fontFamily:"Rockwell",
        fontSize:14,
        fontWeight:"bold",
    }

})