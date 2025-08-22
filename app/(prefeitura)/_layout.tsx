import { Tabs } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "react-native";

export default function PrefeituraTabs() {
  const { logout } = useContext(AuthContext);
  return (
    <Tabs>
      <Tabs.Screen 
        name="notificacaoPrefeitura" 
        options={{ 
          title: "Painel Prefeitura", 
          headerRight: () => (
            <Button title="Sair" onPress={logout} />
          )
        }} 
      />
    </Tabs>
  );
}
