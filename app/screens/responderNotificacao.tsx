import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TextInput, Button, Alert, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, router } from "expo-router";

import { INotificacao } from "../../interfaces/INotificacao";

export default function ResponderNotificacao() {
  const { id } = useLocalSearchParams();
  const [notificacao, setNotificacao] = useState<INotificacao | null>(null);
  const [resposta, setResposta] = useState("");

  useEffect(() => {
    const carregarNotificacao = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId || !id) return;

        const dados = await AsyncStorage.getItem(`notificacoes_${userId}`);
        const lista: INotificacao[] = dados ? JSON.parse(dados) : [];

        const encontrada = lista.find((n) => n.id === id);
        if (encontrada) {
          setNotificacao(encontrada);
          setResposta(encontrada.respostaPrefeitura || "");
        }
      } catch (error) {
        console.error("Erro ao carregar notificação:", error);
      }
    };

    carregarNotificacao();
  }, [id]);

  const salvarResposta = async () => {
    if (!notificacao) return;
    if (!resposta.trim() && resposta.replace(/\s+/g, " ")) {
      Alert.alert("Erro", "A resposta não pode estar vazia ou conter apenas espaços.");
      return;
    }
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;

      const dados = await AsyncStorage.getItem(`notificacoes_${userId}`);
      const lista: INotificacao[] = dados ? JSON.parse(dados) : [];

      const atualizada = lista.map((n) =>
        n.id === notificacao.id
          ? { ...n, respostaPrefeitura: resposta, status: "respondido" }
          : n
      );

      await AsyncStorage.setItem(`notificacoes_${userId}`, JSON.stringify(atualizada));

      Alert.alert("Resposta salva com sucesso!");
      router.replace("/(tabs)/notificacao"); // voltar à lista de notificações
    } catch (error) {
      console.error("Erro ao salvar resposta:", error);
    }
  };

  if (!notificacao) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Carregando notificação...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Responder Notificação</Text>

      <Text style={styles.label}>Descrição:</Text>
      <Text style={styles.texto}>{notificacao.descricao}</Text>

      {notificacao.fotoUrl && (
        <Image source={{ uri: notificacao.fotoUrl }} style={styles.imagem} />
      )}

      <Text style={styles.label}>Local:</Text>
      <Text style={styles.texto}>
        {notificacao.localizacao?.rua}, {notificacao.localizacao?.bairro}, {notificacao.localizacao?.cidade}
      </Text>

      <Text style={styles.label}>Data:</Text>
      <Text style={styles.texto}>{new Date(notificacao.dataEnvio).toLocaleString()}</Text>

      <Text style={styles.label}>Resposta:</Text>
      <TextInput
        style={styles.textarea}
        placeholder="Digite aqui sua resposta..."
        value={resposta}
        onChangeText={setResposta}
        multiline
        numberOfLines={5}
      />

      <View style={styles.botoes}>
        <Button title="Salvar Resposta" onPress={salvarResposta} />
        <Button title="Cancelar" color="#999" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flexGrow: 1 },
  titulo: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { fontWeight: "bold", marginTop: 10 },
  texto: { fontSize: 16, marginBottom: 10 },
  imagem: { width: "100%", height: 200, marginVertical: 15 },
  textarea: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  loading: { marginTop: 50, textAlign: "center", fontSize: 18 },
});
