import React, { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  Linking,
  View,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker";

import { INotificacao } from "../../interfaces/INotificacao";
import NotificationCard from "@/components/CardNotificacao";
import { router, useFocusEffect } from "expo-router";

import { gerarRelatorioPDF } from "@/components/hooks/GerarRelatorio";

export default function notificacaoPrefeitura() {
  const [cidade, setCidade] = useState("");
  const [notificacoes, setNotificacoes] = useState<INotificacao[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [openStatus, setOpenStatus] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Tudo");
  const [itemsStatus, setItemsStatus] = useState([
    { label: "Tudo", value: "Tudo" },
    { label: "Pendente", value: "pendente" },
    { label: "Em análise", value: "análise" },
    { label: "Resolvido", value: "resolvido" },
  ]);

  useFocusEffect(
    useCallback(() => {
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
    },[])
  )

  const abrirNoMapa = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const responderNotificacao = (notificacaoId: string) => {
    router.push(`/screens/responderNotificacao?id=${notificacaoId}&acao=responder`);
  };

  const alterarStatus = (notificacaoId: string) => {
    router.push(`/screens/responderNotificacao?id=${notificacaoId}&acao=status`);
  };

  const notificacoesFiltradas = notificacoes.filter(
    (not) =>
      (cidade === "" ||
        (not.localizacao?.cidade &&
          not.localizacao.cidade
            .toLowerCase()
            .includes(cidade.toLowerCase()))) &&
      (filterStatus === "Tudo" || not.status === filterStatus)
  );

  return (
    <View style={[{ flex: 1 }, styles.container]}>
      <View style={styles.dropdownRow}>
        <View style={styles.dropdownWrapper}>
          <Text>Status:</Text>
          <DropDownPicker
            open={openStatus}
            value={filterStatus}
            items={itemsStatus}
            setOpen={setOpenStatus}
            setValue={setFilterStatus}
            setItems={setItemsStatus}
            style={{ width: 120 }}
            containerStyle={{ width: 140 }}
          />
        </View>
      </View>

      <ScrollView>
        {carregando ? (
          <ActivityIndicator size="large" color="#000" />
        ) : notificacoesFiltradas.length > 0 ? (
          notificacoesFiltradas.map((not) => (
            <NotificationCard
              key={not.id}
              notificacao={not}
              exibirBotoesGerenciamento={true}
              abrirNoMapa={abrirNoMapa}
              onAtualizarStatus={() => alterarStatus(not.id)}
              onResponder={() => responderNotificacao(not.id)}
            />
          ))
        ) : (
          <Text style={styles.noNots}>Nenhuma notificação encontrada.</Text>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => {gerarRelatorioPDF(notificacoes)}}>
        <Text style={styles.fabText}>Gerar Relatório</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  noNots: {
    paddingVertical: 30,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  dropdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  dropdownWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  fab: {
  position: "absolute",
  paddingVertical: 10,
  paddingHorizontal: 20,
  backgroundColor: "blue",
  borderRadius: 30,
  right: 20,
  bottom: 20,
  elevation: 8,
  shadowColor: "#000",
  shadowOpacity: 0.3,
  shadowRadius: 4,
  shadowOffset: { width: 1, height: 2 },
},

fabText: {
  color: "#fff",
  fontWeight: "bold",
},
});
