import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { router } from "expo-router";

export default function UserTabs() {
  const { userData } = useContext(AuthContext);

  return (
    <Drawer
    screenOptions={{
      drawerActiveTintColor: "white",
      drawerActiveBackgroundColor: "blue",
      drawerLabelStyle: {
        fontWeight: "bold",
      },
    }}
    drawerContent={(drawerProps) => (
      <DrawerContentScrollView
        {...drawerProps}
        contentContainerStyle={{ flex: 1 }}
      >
        
        <View style={{ flex: 1 }}>
          <DrawerItemList {...drawerProps} />
        </View>

        <TouchableOpacity
          style={styles.profileContainer}
          onPress={() => {router.push('/screens/profile')}}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="person-outline" size={24} />
          </View>
          <View>
            <Text style={styles.username}>
              {userData?.username ?? "Usuário"}
            </Text>
            <Text style={styles.profileText}>Ver Perfil</Text>
          </View>
        </TouchableOpacity>
      </DrawerContentScrollView>
    )}
    >
      <Drawer.Screen
        name="minhasNotificacoes"
        options={{
          title: "Minhas Notificações",
          headerTitle: () => (
            <Text style={{ fontWeight: "bold", fontSize: 20, color: "blue" }}>
              Minhas Notificações
            </Text>
          ),
          headerTitleAlign: "center",
          headerRight: () => (
            <Ionicons name="notifications-outline" size={24} style={{ marginRight: 15 }} />
          ),
        }}
        
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
  },
  profileText: {
    fontSize: 12,
    color: "#666",
  },
});
