import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TextInput, Button, Alert, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, router } from "expo-router";

import { INotificacao } from "../../interfaces/INotificacao";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";

export default function ResponderNotificacao() {
  const { id, acao } = useLocalSearchParams();
  const [notificacao, setNotificacao] = useState<INotificacao | null>(null);
  const [resposta, setResposta] = useState("");
  const [status, setStatus] = useState("Pendente");

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
          setStatus(encontrada.status || "Pendente");
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

    if (status === "resolvido" && !resposta) {
      Alert.alert("Erro", "Você precisa adicionar uma foto ao marcar como 'resolvido'.");
      return;
    }

    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;

      const dados = await AsyncStorage.getItem(`notificacoes_${userId}`);
      const lista: INotificacao[] = dados ? JSON.parse(dados) : [];

      const atualizada = lista.map((n) =>
        n.id === notificacao.id
          ? { ...n, respostaPrefeitura: resposta, status: status }
          : n
      );

      await AsyncStorage.setItem(`notificacoes_${userId}`, JSON.stringify(atualizada));

      Alert.alert(status == "responder" ? "Resposta salva com sucesso!" : "Status alterado com sucesso!");
      router.back();
    } catch (error) {
      console.error("Erro ao salvar resposta:", error);
    }
  };

  const tirarFoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão negada", "Precisamos de acesso à câmera.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setResposta(result.assets[0].uri);
    }
  };

  const escolherFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({});
    if (!result.canceled) {
      setResposta(result.assets[0].uri);
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
      <Text style={styles.titulo}>{acao == 'status' ? 'Alterar Status' : 'Responder Notificação'}</Text>

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

      {acao == 'responder' ?
        <>
          <Text style={styles.label}>Resposta:</Text>
          <TextInput
            style={styles.textarea}
            placeholder="Digite aqui sua resposta..."
            value={resposta}
            onChangeText={setResposta}
            multiline
            numberOfLines={5}
          />
        </>
        :
        <>
          <Text style={styles.label}>Status:</Text>
          <View style={styles.statusButtons}>
            {["análise", "resolvido"].map((option) => (
              <TouchableOpacity
              key={option}
              onPress={() => setStatus(option)}
              style={[styles.statusButton, status === option && styles.selectedStatus]}>
              <Text style={styles.statusButtonText}>{option}</Text>
            </TouchableOpacity>
            ))}
          </View>

          {status === "resolvido" && (
            <TouchableOpacity
              style={styles.imagePicker}
              onPress={() => {
                Alert.alert("Adicionar Foto", "Escolha uma opção", [
                  { text: "Tirar Foto", onPress: tirarFoto },
                  { text: "Escolher da Galeria", onPress: escolherFoto },
                  { text: "Cancelar", style: "cancel" },
                ]);
              }}
            >
              {resposta ? (
                <Image source={{ uri: resposta }} style={styles.imagem} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <FontAwesome name="camera" size={40} color="#ccc" />
                  <Text style={styles.imagePlaceholderText}>
                    Toque para adicionar uma foto
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </>
      }

      <View style={styles.botoes}>
        <Button title={acao == "responder" ? "Salvar Resposta" : "Alterar Status"} onPress={salvarResposta} />
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
  statusButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  statusButton: {
    marginHorizontal: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
  },
  selectedStatus: {
    backgroundColor: "#007BFF",
  },
  statusButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  loading: { marginTop: 50, textAlign: "center", fontSize: 18 },
  imagePicker: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    overflow: "hidden",
  },
  imagePlaceholder: {
    alignItems: "center",
  },
  imagePlaceholderText: {
    color: "#aaa",
    marginTop: 10,
  },
});
