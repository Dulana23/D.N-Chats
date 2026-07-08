import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { FlatList, Image, ImageBackground, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function chat(){
       
    
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [userName, setUserName] = useState("");

    const [loggedUser, setLoggedUser] = useState<any>(null);

    const [text, settext] = useState("");

    const webSocket = useRef<WebSocket>(null);

    const router = useRouter();

    const params = useLocalSearchParams();
    const chatId = params.chatId;
    const userId = params.userId;


    useEffect(() => {

        setUserName(params.userName + "");

        loadChatHistory();
        connectWebSocket();

        return () => {
            webSocket.current?.close();
        }

    }, []);

    async function loadChatHistory() {

        const apiUrl = process.env.EXPO_PUBLIC_API_URL;

        const response = await fetch(apiUrl + "/msg_history/get-msg_history?id=" + chatId);

        const data = await response.json();

        if (response.ok) {

            setChatHistory(data);

        } else {
            console.log(response.status + "  : " + data.msg);
            alert("Something went wrong");
        }

    }

    function timeFormat(time: string) {

        const formattedTime = new Date(time).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

        return formattedTime;

    }

    async function connectWebSocket() {

        const user = await AsyncStorage.getItem("user");

        let userObj: any;

        if (user) {
            userObj = JSON.parse(user);
            setLoggedUser(userObj);
        }

        webSocket.current = new WebSocket("ws://192.168.8.169:3000");

        console.log("Web socket starting...")

        webSocket.current.onopen = () => {
            console.log("Connected to webSocket");

            if (webSocket.current) {


                const data = {
                    type: "register",
                    data: userObj.mobile
                };

                webSocket.current.send(JSON.stringify(data));


            }

        }


        webSocket.current.onmessage = (event) => {

            const message = JSON.parse(event.data);

            console.log(message);

            setChatHistory(chatArray => [ message, ...chatArray]);

        }

    }
    return(
       
    <KeyboardAvoidingView
          style={{ flex: 1 }}
                 behavior={Platform.OS === "ios" ? "padding" : "height"}
  
        >

    <SafeAreaView style={styles.container}>

        <View style={styles.headerView}>
            <Entypo name="chevron-left" size={24} color="black" onPress={() => {
                router.back();
            }} />
            <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/4140/4140073.png" }}
                style={styles.profilePic}
            />
            <View style={{ flex: 1, gap: 3 }}>
                <Text style={styles.nameTxt}>{userName}</Text>
                <View style={styles.statusView}>
                    <View style={styles.statusBall} />
                    <Text style={styles.statusTxt}>Online</Text>
                </View>
            </View>
            <SimpleLineIcons name="options-vertical" size={16} color="black" />
        </View>
          
   <ImageBackground
       source={require("../assets/images/Chat-wallpaper.png")}
           style={[styles.bodyView,{flex:1}]}  resizeMode="cover"
>
    <FlatList
        data={chatHistory}
      
        renderItem={({ item }) => {
            return (
                <View
                    style={[
                        styles.messageView,
                        {
                            alignItems:
                                Number(loggedUser?.user_id) === Number(item.sender_id)
                                    ? "flex-start"
                                    : "flex-end",
                        },
                    ]}
                >
                    <View
                        style={[
                            styles.message,
                            Number(loggedUser?.user_id) === Number(item.sender_id)
                                ? styles.sendMsg
                                : styles.receiveMsg,
                        ]}
                    >
                        <Text
                            style={{
                                color:
                                    Number(loggedUser?.user_id) === Number(item.sender_id)
                                        ? "#fff"
                                        : "#000",
                            }}
                        >
                            {item.message_text}
                        </Text>

                        <Text
                            style={[
                                styles.msgTime,
                                {
                                    color:
                                        Number(loggedUser?.user_id) === Number(item.sender_id)
                                            ? "#fff"
                                            : "#666",
                                },
                            ]}
                        >
                            {timeFormat(item.sent_at)}
                        </Text>
                    </View>
                </View>
            );
        }}
        inverted
    />


        <View style={styles.inputView}>

            <TextInput style={styles.input} placeholder='Enter Message' onChangeText={settext} value={text} />

            <Pressable style={styles.sendBtn} onPress={() => {

               if (webSocket.current && text.trim() !== "") {

   
                      const msg = {
                        message_text: text,
                        sent_at: new Date().toISOString(),
                        receiver_id: loggedUser.user_id,
                       chat_id: Number(chatId),
                       status: "sent",
                       };

                  setChatHistory((oldChat) => [msg, ...oldChat]);

                  const data = {
                    type: "chat",
                    message_text: text,
                    receiver_id: loggedUser.user_id,
                    sender_id: Number(params.userId), 
                    chat_id: Number(chatId),
                };

    console.log("Sending:", data);

    webSocket.current.send(JSON.stringify(data));

    settext("");
}

           }}>
                <FontAwesome name="send" size={24} color="white" />
            </Pressable>

        </View>
        </ImageBackground>
    </SafeAreaView>

</KeyboardAvoidingView>

    );
}
const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    headerView: {
        backgroundColor: "white",
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 15
    },
    profilePic: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    nameTxt: {
        color: "black",
        fontWeight: '500',
        fontSize: 18
    },
    statusView: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5
    },
    statusTxt: {
        color: "#a4a4a4",
        fontSize: 12,
    },
    statusBall: {
        width: 10,
        height: 10,
        borderRadius: 50,
        backgroundColor: "#64fd85"
    },

    bodyView: {
        flex: 1,
        backgroundColor: "#eff3ff",
        padding: 20,
    },

    msgTime: {
        color: "#8f8f8f",
        fontSize: 12,
    },

    message: {
        fontWeight: "600",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        maxWidth: "90%",
       
    },

    messageView: {
        width: "100%",
        gap: 50,
        marginVertical: 5,
    },

    sendMsg: {
        backgroundColor: "#005eff",
        color: "white",
        borderTopLeftRadius: 0,
    },

    receiveMsg: {
        backgroundColor: "#ffffff",
        color: "black",
        borderTopRightRadius: 0,
       
    },


    inputView: {
        
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
       
    },

    input: {
        backgroundColor: "white",
        flex: 1,
        height: 50,
        width: 200,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    sendBtn: {
        backgroundColor: "#005eff",
        padding: 10,
        borderRadius: 50,
        width: 50,
        height: 50
    },

});