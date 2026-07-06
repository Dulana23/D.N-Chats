import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp(){

     const [fname, setFName] = useState("");
     const [lname, setLname] = useState("");
     const [mobile, setMobile] = useState("");
     const [password, setPassword] = useState(""); 
         
      const router = useRouter();

      async function signUpRequest(){
             
            console.log("Sign Up");
           if(fname !== "" && lname !== "" && mobile !== "" && password !== ""){
            const RegisterData ={
                  fname:fname,
                  lname:lname,
                  mobile:mobile,
                  password:password
            }
            const apiURL = process.env.EXPO_PUBLIC_API_URL;
          try{
            const response =  await fetch(apiURL+"/user/signup",{
                  method : "POST",
                  headers : {"Content-Type" : "application/json"},
                  body : JSON.stringify(RegisterData),

                });
             
            
              const regdata = await response.json();
              alert(response.status +" : "+regdata.message);
            

       }catch(error){
            alert("An error occurred during registration");
            console.error("Error during registration", error);
       }

           } else{
            alert("Please fill all the fields");
           }
            
}

    return (
       <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height" }>
            <ScrollView contentContainerStyle={{flexGrow:1, gap:18, padding:20,alignItems: "center"}}>
            <Image
                  source={require("../assets/images/SignUp.jpg")}
                  style={styles.img}
            />

            <View style={styles.textView}>
                  <Text style={styles.titleTxt}>Register</Text>
                  <Text style={styles.descriptionTxt}>Please create new account. Here!!</Text>
            </View>
            <View style={styles.inputView}>
                  <AntDesign name="user-add" size={20} color="black"/>
                  <TextInput style={styles.input} placeholder='Enter Your First Name' onChangeText={setFName}/>
            </View>
            <View style={styles.inputView}>
                  <AntDesign name="user-add" size={20} color="black"/>
                  <TextInput style={styles.input} placeholder='Enter Your Last Name' onChangeText={setLname}/>
            </View>
            <View style={styles.inputView}>
                  <AntDesign name="user-add" size={20} color="black"/>
                  <TextInput style={styles.input} placeholder='Enter Your Mobile Number' onChangeText={setMobile}/>
            </View>

            <View style={styles.inputView}>
            <     Entypo name="lock" size={24} color="black" />
                  <TextInput style={styles.input} placeholder='Enter Your Password' onChangeText={setPassword}/>
            </View>

            <Pressable style={styles.btn} onPress={()=>{
                   signUpRequest();
            }}>  
                    <Text style={styles.btnTxt}>Create Account</Text>
            </Pressable>

            <View style={{flexDirection:"row", gap:10}}>
                  <Text style={{color:"#8b8b8b"}}>Do you Have Account</Text>
                  <Text style={{fontWeight:"bold", fontSize:15}} 
                                     onPress={()=>{
                                   /* router.replace("/");*/
                                  }}>Sign In</Text>
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
            gap : 18,
           
      },
      img :{
          width: "100%",
          height: 200,
          
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