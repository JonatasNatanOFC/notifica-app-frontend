import { Tabs } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "react-native";

export default function UserTabs() {
  const { logout } = useContext(AuthContext);

  return (
    <Tabs>
      <Tabs.Screen
        name="notificacao"
        options={{
          title: "Criar notificação",
          headerRight: () => (
            <Button title="Sair" onPress={logout} />
          ),
        }}
      />
      <Tabs.Screen
        name="minhasNotificacoes"
        options={{
          title: "Notificações",
          headerRight: () => (
            <Button title="Sair" onPress={logout} />
          ),
        }}
      />
    </Tabs>
  );
}
