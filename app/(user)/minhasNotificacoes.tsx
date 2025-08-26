import React, { useCallback, useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Linking,
  View,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

import { INotificacao } from "../../interfaces/INotificacao";
import CardNotificacao from "@/components/CardNotificacao";
import ApagarNotificacao from "@/components/hooks/ApagarNotificacao";
import ModalCriarNotificacao from "@/components/ModalCriarNotificacao"; // 1. Importe o novo modal

export default function MinhasNotificacoes() {
  const [notificacoes, setNotificacoes] = useState<INotificacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false); // 2. Estado para controlar o modal

  const carregarNotificacoes = async () => {
    if (!carregando) setCarregando(true);
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        setNotificacoes([]);
        return;
      }
      const dados = await AsyncStorage.getItem(`notificacoes_${userId}`);
      const lista: INotificacao[] = dados ? JSON.parse(dados) : [];
      setNotificacoes(lista.reverse());
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setCarregando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarNotificacoes();
    }, [])
  );

  const abrirNoMapa = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url).catch((err) =>
      console.error("Erro ao abrir o mapa:", err)
    );
  };

  const onDelete = async (id: number) => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) return;

    await ApagarNotificacao(id, notificacoes, `notificacoes_${userId}`);

    setNotificacoes((prevNotificacoes) =>
      prevNotificacoes.filter((not) => Number(not.id) !== id)
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f0f0" />
      <ScrollView>
        {carregando ? (
          <ActivityIndicator size="large" color="#000" />
        ) : notificacoes.length > 0 ? (
          notificacoes.map((not) => (
            <CardNotificacao
              key={not.id}
              notificacao={not}
              exibirBotoesGerenciamento={false}
              abrirNoMapa={abrirNoMapa}
              id={Number(not.id)}
              onDelete={onDelete}
            />
          ))
        ) : (
          <Text style={styles.noNots}>Nenhuma notificação enviada ainda.</Text>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)} // 3. O botão agora abre o modal
      >
        <FontAwesome name="plus" size={22} color="#fff" />
      </TouchableOpacity>

      {/* 4. Renderize o modal aqui */}
      <ModalCriarNotificacao
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={() => {
          setModalVisible(false);
          carregarNotificacoes(); // Recarrega a lista após salvar
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  noNots: {
    paddingVertical: 30,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#007BFF",
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 2 },
  },
});
