import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

export default function PrefeituraTabs() {
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
          onPress={() => console.log(userData)}
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
        name="notificacaoPrefeitura"
        options={{
          title: "Painel Administrativo",
          headerTitle: () => (
            <Text style={{ fontWeight: "bold", fontSize: 20, color: "blue" }}>
              Painel Administrativo
            </Text>
          ),
          headerTitleAlign: "center",
          headerRight: () => (
            <Ionicons name="notifications-outline" size={24} style={{ marginRight: 15 }} />
          )
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
