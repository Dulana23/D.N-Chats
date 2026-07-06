import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
/*import AsyncStorage from '@react-native-async-storage/async-storage';*/

import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login(){

            return (
                  
                  <SafeAreaView style={styles.container}>
                       <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height" }>
                       <ScrollView contentContainerStyle={{flexGrow:1, gap:18,padding: 20 ,alignItems: "center"}}>
                       <Image
                             source={require("../assets/images/login.jpg")}
                             style={styles.img}
                       />
           
                       <View style={styles.textView}>
                             <Text style={styles.titleTxt}>Sign In</Text>
                             <Text style={styles.descriptionTxt}>Please Sign in to continue</Text>
                       </View>
                       <View style={styles.inputView}>
                             <AntDesign name="user-add" size={20} color="black"/>
                             <TextInput style={styles.input} placeholder='Enter Your Mobile Number' />
                       </View>
           
                       <View style={styles.inputView}>
                           <Entypo name="lock" size={24} color="black" />
                             <TextInput style={styles.input} placeholder='Enter Your Password'/>
                       </View>
           
                       <Pressable style={styles.btn} onPress={()=>{
                              
                       }}>  
                               <Text style={styles.btnTxt}>Sign In</Text>
                       </Pressable>
           
                       <View style={{flexDirection:"row", gap:10}}>
                             <Text style={{color:"#8b8b8b"}}>Don't Have Account</Text>
                             <Text style={{fontWeight:"bold", fontSize:15}} 
                                               >Sign Up</Text>
                       </View>
           
                       </ScrollView>
                       </KeyboardAvoidingView>
                  </SafeAreaView>
               )
      }
    


const styles = StyleSheet.create({
      inputView:{
           width: "100%",
           height: "auto",
           flexDirection:"row",
           backgroundColor:"#ececec",
           borderRadius: 30,
           paddingHorizontal:20,
           paddingVertical :10,
           justifyContent :"center",
           gap :10,
      },
      container : {
            flex : 1,
            backgroundColor : "#fff",
            alignItems : "center",
            gap : 15,
      },
      img :{
          width: 300,
          height: 300,
          
      },

      input:{
            width: "90%",
            padding:5,
            
      },
      btn:{
      backgroundColor: "blue",
      borderRadius :50,
      padding :15,
      width :"100%",
      height: "auto",
      alignItems:"center",
      gap: 5,
      },

      btnTxt:{
            color : "white",
            fontSize: 16,
            fontWeight: "bold",

      },

      textView:{
            alignItems :"center",
            marginBottom:20,
      },

      titleTxt:{
            fontWeight: "bold",
            fontSize : 22,
      },

      descriptionTxt:{
            marginTop:5,
            color: "#707070",
      }
})