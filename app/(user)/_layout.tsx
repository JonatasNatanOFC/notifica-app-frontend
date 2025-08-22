// app/tabs/user.tsx
import { Tabs } from "expo-router";

export default function UserTabs() {
  return (
    <Tabs>
      <Tabs.Screen name="notificacao" options={{ title: "Criar notificação" }} />
      <Tabs.Screen name="minhasNotificacoes" options={{ title: "Notificações" }} />
    </Tabs>
  );
}
