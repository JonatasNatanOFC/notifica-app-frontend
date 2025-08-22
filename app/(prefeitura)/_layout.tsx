// app/tabs/prefeitura.tsx
import { Tabs } from "expo-router";

export default function PrefeituraTabs() {
  return (
    <Tabs>
      <Tabs.Screen name="notificacaoPrefeitura" options={{ title: "Painel Prefeitura" }} />
    </Tabs>
  );
}
