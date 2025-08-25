import { Tabs } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "react-native";
import Drawer from "expo-router/drawer";

export default function PrefeituraTabs() {
  const { logout } = useContext(AuthContext);
  return (
    <Drawer
      screenOptions={{
      headerTintColor: '#333',
      drawerActiveTintColor: '#007bff',
      drawerLabelStyle: {
        marginLeft: 20,
      },
    }}>
      <Drawer.Screen 
        name="notificacaoPrefeitura" 
        options={{ 
          title: "Painel Prefeitura", 
          headerRight: () => (
            <Button title="Sair" onPress={logout} />
          )
        }} 
      />
    </Drawer>
  );
}
