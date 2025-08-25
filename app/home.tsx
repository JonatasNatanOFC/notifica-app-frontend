import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import StepItem from "../components/StepItem";

const stepsData = [
  {
    iconName: "photo-camera",
    title: "1. Fotografe e Localize",
    description:
      "Registre o problema com uma foto. O app identifica o local para você.",
  },
  {
    iconName: "description",
    title: "2. Descreva e Envie",
    description:
      "Adicione detalhes e envie. Sua notificação vai direto para o setor responsável.",
  },
  {
    iconName: "check-circle",
    title: "3. Acompanhe a Solução",
    description:
      "Receba atualizações em tempo real sobre o andamento do seu chamado.",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f0f0" />
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.titleLogo}>Notifica App</Text>
          <View style={styles.acessButton}>
            <TouchableOpacity onPress={() => router.push("../login")}>
              <Text style={styles.textAcessButton}>Acessar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text style={styles.title}>A sua voz para uma cidade melhor.</Text>
          <Text style={styles.description}>
            Viu um problema na sua rua? Um buraco, lixo acumulado ou uma lâmpada
            queimada? Reporte diretamente para a prefeitura e acompanhe a
            solução.
          </Text>

          <View style={styles.promoContainer}>
            <Image
              source={require("../assets/images/imagemLandingPage.png")}
              style={styles.imgPerson}
            />

            <View style={styles.howToUse}>
              <Text style={styles.titleHow}>Como funciona?</Text>
              <Text style={styles.descriptionHow}>
                Em 3 passos simples você faz a diferença.
              </Text>

              {stepsData.map((step, index) => (
                <StepItem
                  key={index}
                  iconName={step.iconName as any}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </View>
          </View>
        </View>
        <Text
          style={{
            textAlign: "center",
            marginTop: 20,
            color: "#4F4F4F",
            fontSize: 12,
          }}
        >
          © 2025 Notifica App
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  acessButton: {
    backgroundColor: "#2109FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  textAcessButton: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  titleLogo: {
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Karantina",
    color: "#2109FF",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    fontFamily: "Karantina",
    color: "#000000",
    textAlign: "center",
    paddingHorizontal: 20,
    marginTop: 20,
    lineHeight: 38,
  },
  description: {
    fontSize: 16,
    fontFamily: "Kodchasan",
    color: "#4F4F4F",
    textAlign: "center",
    marginVertical: 20,
    paddingHorizontal: 36,
    lineHeight: 22,
  },
  promoContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  imgPerson: {
    width: "100%",
    height: 280,
    resizeMode: "contain",
  },
  howToUse: {
    backgroundColor: "#ffffff",
    padding: 26,
    borderRadius: 20,
    marginHorizontal: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    width: "90%",
  },
  titleHow: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Karantina",
    color: "#000000",
    textAlign: "center",
    marginBottom: 10,
  },
  descriptionHow: {
    fontSize: 16,
    fontFamily: "Kodchasan",
    color: "#4F4F4F",
    textAlign: "center",
    marginBottom: 25,
  },
});
