import { Tabs } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "react-native";
import { Drawer } from "expo-router/drawer";

export default function UserTabs() {
  const { logout } = useContext(AuthContext);

  return (
    <Drawer>
      <Drawer.Screen
        name="notificacao"
        options={{
          title: "Criar notificação",
          headerRight: () => (
            <Button title="Sair" onPress={logout} />
          ),
        }}
      />
      <Drawer.Screen
        name="minhasNotificacoes"
        options={{
          title: "Notificações",
          headerRight: () => (
            <Button title="Sair" onPress={logout} />
          ),
        }}
      />
    </Drawer>
  );
}
