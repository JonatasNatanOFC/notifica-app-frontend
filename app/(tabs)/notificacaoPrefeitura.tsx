import React, { useEffect, useState } from "react";
import { ScrollView, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Linking } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { INotificacao } from "../../interfaces/INotificacao";
import CardNotificacao from "@/components/CardNotificacao";
import { router } from "expo-router";

export default function notificacaoPrefeitura() {
  const [cidade, setCidade] = useState("");
  const [notificacoes, setNotificacoes] = useState<INotificacao[]>([]);
  const [carregando, setCarregando] = useState(true);

  const notificacoesFiltradas = notificacoes.filter(
    (not) =>
      cidade === "" ||
      (not.localizacao?.cidade &&
        not.localizacao.cidade.toLowerCase().includes(cidade.toLowerCase()))
  );

  useEffect(() => {
    const carregarNotificacoes = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) return;

        const dados = await AsyncStorage.getItem(`notificacoes_${userId}`);
        const lista: INotificacao[] = dados ? JSON.parse(dados) : [];

        setNotificacoes(lista.reverse());
      } catch (error) {
        console.error("Erro ao carregar notificações:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarNotificacoes();
  }, []);

  // --- ALTERAÇÃO 1: Função para lidar com a mudança de status ---
  const marcarComoResolvido = async (notificacaoId: string) => {
    try {
      const notificacoesAtualizadas = notificacoes.map((not) => {
        if (not.id === notificacaoId) {
          // Retorna um novo objeto com o status alterado
          // A correção do TypeScript foi aplicada aqui com "as 'resolvido'"
          return { ...not, status: "resolvido" as "resolvido" };
        }
        return not; // Retorna a notificação sem alterações
      });

      setNotificacoes(notificacoesAtualizadas);

      // Salva a lista atualizada de volta no AsyncStorage
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        // Revertemos a ordem novamente para salvar no formato original no storage
        await AsyncStorage.setItem(
          `notificacoes_${userId}`,
          JSON.stringify(notificacoesAtualizadas.reverse())
        );
      }
    } catch (error) {
      console.error("Erro ao marcar como resolvido:", error);
    }
  };

  const abrirNoMapa = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const responderNotificacao = (notificacaoId: string) => {
    router.push(`/screens/responderNotificacao?id=${notificacaoId}`);
  };


  return (
    <ScrollView style={styles.container}>
      {carregando ? (
        <ActivityIndicator size="large" color="#000" />
      ) : notificacoes.length > 0 ? (
        notificacoesFiltradas.map((not) => (
          <CardNotificacao
            key={not.id}
            notificacao={not}
            exibirBotoesGerenciamento={true}
            abrirNoMapa={abrirNoMapa}
            // --- ALTERAÇÃO 2: Passando a função como prop para o card ---
            onMarcarResolvido={marcarComoResolvido}
            onResponder={() => responderNotificacao(not.id)}
            
          />
        ))
      ) : (
        <Text style={styles.noNots}>Nenhuma notificação enviada ainda.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  noNots: {
    paddingVertical: 30,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
  },
});
