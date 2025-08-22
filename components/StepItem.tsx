import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// Definimos as propriedades que o componente vai receber
type StepItemProps = {
  iconName: React.ComponentProps<typeof MaterialIcons>["name"];
  title: string;
  description: string;
};

const StepItem = ({ iconName, title, description }: StepItemProps) => {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.icon}>
        <MaterialIcons name={iconName} size={40} color="#2109FF" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDescription}>{description}</Text>
      </View>
    </View>
  );
};

// Os estilos são os mesmos que você já tinha, mas agora ficam dentro do componente
const styles = StyleSheet.create({
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Kodchasan",
  },
  stepDescription: {
    fontSize: 14,
    color: "#4F4F4F",
    fontFamily: "Kodchasan",
    marginTop: 4,
  },
});

export default StepItem;
