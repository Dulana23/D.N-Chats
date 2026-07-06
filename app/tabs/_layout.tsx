import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from "expo-router";

export default function TabLayout() {

    return (
        <Tabs screenOptions={{ headerShown: false }}>

            <Tabs.Screen name="home" options={{
                tabBarLabel: "Home",
                tabBarIcon: ({ color, size }) => {
                    return (
                        <MaterialIcons name="home" size={size} color={color} />
                    );
                }
            }} />

            <Tabs.Screen name="group" options={{
                tabBarLabel: "Group",
                tabBarIcon: ({ color, size }) => {
                    return (
                        <FontAwesome name="group" size={size} color={color} />
                    );
                }
            }} />

            <Tabs.Screen name="status" options={{
                tabBarLabel: "Updates",
                tabBarIcon: ({ color, size }) => {
                    return (
                        <AntDesign name="up-circle" size={size} color={color} />
                    );
                }
            }} />

        </Tabs>
    );

}