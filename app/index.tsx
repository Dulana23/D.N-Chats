import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ImageBackground, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {

    const [mobile, setMobile] = useState("");
    const [password, setPassworde] = useState("");

    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {

        async function checkUser() {

            const user = await AsyncStorage.getItem("user");

            if (user) {
                router.replace("/tabs/home");
            } else {

                setIsLoading(false);

            }


        }

        checkUser();

    }, []);







    async function signIn() {

        if (mobile !== "" && password !== "") {

            const loginData = {
                mobile: mobile,
                password: password
            };

            try {

                const apiUrl = process.env.EXPO_PUBLIC_API_URL;

                const response = await fetch(apiUrl + "/user/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(loginData)
                });

                if (response.ok) {

                    const data = await response.json();
                    console.log(data.user);

                    await AsyncStorage.setItem("user", JSON.stringify(data.user));

                    router.push("/tabs/home");

                } else {

                    const data = await response.json();
                    console.log(data.msg);
                    alert(data.msg);

                }

            } catch (err) {
                console.error(err);
            }

        }

    }


    if (!isLoading) {

        return (
            <ImageBackground source={require("../assets/images/background.jpg")} style={styles.background}resizeMode="cover" >
            <SafeAreaView style={styles.container}>

                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>

                    <ScrollView contentContainerStyle={{ flexGrow: 1, gap: 18, alignItems: "center" }}>

                        <Image
                            source={require("../assets/images/logo.png")}
                            style={styles.img}
                        />

                        <View style={styles.textView}>
                            <Text style={styles.titleTxt}>SignIn</Text>
                            <Text style={styles.descriptionTxt}>Please Sign in to continue.</Text>
                        </View>

                        <View style={styles.inputView}>
                            <AntDesign name="user-add" size={20} color="#696969" />
                            <TextInput style={styles.input} placeholder='Enter your Mobile' onChangeText={setMobile} />
                        </View>

                        <View style={styles.inputView}>
                            <MaterialIcons name="lock-outline" size={22} color="#696969" />
                            <TextInput style={styles.input} placeholder='Enter your Password' onChangeText={setPassworde} />
                        </View>

                        <Pressable style={styles.btn} onPress={() => {
                            signIn();
                        }}>
                            <Text style={styles.btnTxt}>Sign In</Text>
                        </Pressable>

                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <Text style={{ color: "#8b8b8b" }}>{"Don't have account?"}</Text>
                            <Pressable style={{ height: 30 }} onPress={() => {
                                router.push("/signup");
                            }}>
                                <Text style={{ fontWeight: "bold", fontSize: 15, }} >Sign Up</Text>
                            </Pressable>
                        </View>

                    </ScrollView>

                </KeyboardAvoidingView>

            </SafeAreaView>
            </ImageBackground>
        );

    }

}

const styles = StyleSheet.create({

    descriptionTxt: {
        color: "#707070",
        marginTop: 5,
    },
    
    background: {
      flex: 1,
    },
    
    titleTxt: {
        fontWeight: "bold",
        fontSize: 22,
    },

    textView: {
        alignItems: "center",
        marginBottom: 20,
    },

    btnTxt: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    btn: {
        backgroundColor: "#0066ff",
        borderRadius: 50,
        padding: 10,
        width: "100%",
        alignItems: "center",
    },
    inputView: {
        width: "100%",
        height: "auto",
        flexDirection: "row",
        backgroundColor: "#ececec",
        borderRadius: 50,
        paddingHorizontal: 18,
        paddingVertical: 8,
        justifyContent: "center",
        gap: 5,
    },

    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 20,
        alignItems: "center",
        gap: 18,
    },
    img: {
        width: 300,
        height: 300,
    },
    input: {
        width: "90%",
        padding: 5,
    },
});