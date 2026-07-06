import { FlatList, Image, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MaterialIcons } from "@expo/vector-icons";
import Octicons from '@expo/vector-icons/Octicons';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";


export default function Home({}){
    const router = useRouter();

    const [chatData, setChatData] = useState<any[]>([]);
    const [isRefresh, setIsRefresh] = useState(false);
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState<number | null>(null);

    const [menuVisible, setMenuVisible] = useState(false);

    async function loadChats(userId : number) {

      setIsRefresh(true);

      try {

          const apiUrl = process.env.EXPO_PUBLIC_API_URL;

          const response = await fetch(apiUrl + "/chat/get-chats?user_id=" + userId);

          const data = await response.json();
          setIsRefresh(false);

          if (response.ok) {

              setChatData(data);

          } else {

              alert(response.status + " : " + data.msg);
          }

      } catch (err) {
          console.log(err);
      }

  }

  async function getUser() {

    const userString = await AsyncStorage.getItem("user");
    if (!userString) return;

    const userObj = JSON.parse(userString);

    console.log("User Object:", userObj);

    setUserId(userObj.user_id);  

    loadChats(userObj.user_id);

}

useFocusEffect(
  useCallback(() => {
      getUser();
  }, [])
);

    function timeFormat(time: string) {

      const formattedTime = new Date(time).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
      });

      return formattedTime;

  }
     return(
        <SafeAreaView style={styles.container}>
              <View style={styles.headerView}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>D.N.Chats</Text>
                
                <Octicons name="bell" size={20} color="#a1a1a1" />

                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                  <MaterialIcons name="more-vert" size={28} color="black" />
               </TouchableOpacity>
            </View>
                 
            <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menu}>

            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                setMenuVisible(false);
                router.push("/profile");
              }}
            >
              <Text style={styles.text}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                setMenuVisible(false);
                router.push("/settings");
              }}
            >
              <Text style={styles.text}>Settings</Text>
            </TouchableOpacity>

          </View>
        </Pressable>
      </Modal>

            <View style={styles.searchView}>
                <Octicons name="search" size={20} color="#a1a1a1" />
                <TextInput placeholder='Search' autoFocus={false} />
            </View>
          
            <FlatList
                data={chatData}
                keyExtractor={(item) => item.chat_id.toString()}

                renderItem={({ item }) => {
                  console.log("FlatList Item:", JSON.stringify(item, null, 2));

                    return (
                        <Pressable style={styles.chatView} onPress={() => {
                            router.push({
                                pathname: "/chat",
                                params: {
                                  chatId: item.chat_id,
                                  userId: item.user?.user_id,
                                  userName: `${item.user?.first_name} ${item.user?.last_name}`,
  
  
                               

                                }
                             
                            });
                       ;
                        }}>
                            <Image
                                source={{ uri: item.user?.img ? "http://192.168.8.169:3000"+item.user.img : "https://cdn-icons-png.flaticon.com/512/4140/4140073.png" }}
                                style={styles.profilePic}
                            />
                            <View style={{ gap: 3 }}>
                                <Text style={styles.nameTxt}> {item.user?.first_name} {item.user?.last_name}</Text>
                                <Text style={styles.msgTxt}>{item.last_message
                            ? item.last_message.message_text : "No messages yet"}</Text>
                            </View>
                            <Text style={styles.time}>{timeFormat(item.last_message.sent_at)}</Text>
                        </Pressable>
                    );
                }}

                refreshing={isRefresh}
                onRefresh={() => {
                    if (userId) {
                        loadChats(userId);
                    }
                }}
            />
        </SafeAreaView>
     );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 10,
        gap: 15,
        backgroundColor: "white",
        flex: 1
    },
 
    headerView: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
    },
    searchView: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f3f3f3",
        paddingHorizontal: 15,
        borderRadius: 50,
        gap: 5,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.2)",
      },

      menu: {
        position: "absolute",
        top: 60,
        right: 10,
        width: 170,
        backgroundColor: "#fff",
        borderRadius: 8,
        elevation: 8,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      item: {
        padding: 15,
      },
    
      text: {
        fontSize: 16,
      },
     
      profilePic: {
        width: 60,
        height: 60,
        borderRadius: 50,
    },
      chatView: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
        paddingBottom: 15,
    },
    msgTxt: {
        fontSize: 14,
        color: "#a1a1a1"
    },
    nameTxt: {
        fontSize: 16,
        fontWeight: "600",
       
    },
    time: {
        flex: 1,
        textAlign: 'right',
        color: "#979797"
    }
})
