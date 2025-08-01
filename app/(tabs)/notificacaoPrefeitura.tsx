import React, { useEffect, useState } from 'react';
import {
  ScrollView, Text, StyleSheet, ActivityIndicator
} from 'react-native';
import { Linking } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { INotificacao } from '../../interfaces/INotificacao';
import CardNotificacao from '@/components/CardNotificacao';

export default function notificacaoPrefeitura() {
    const [cidade, setCidade] = useState('');
  const [notificacoes, setNotificacoes] = useState<INotificacao[]>([]);
    const [carregando, setCarregando] = useState(true);

    const notificacoesFiltradas = notificacoes.filter(not =>
        cidade === '' || (not.localizacao?.cidade && not.localizacao.cidade.toLowerCase().includes(cidade.toLowerCase()))
    )

  useEffect(() => {
    const carregarNotificacoes = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return;

        const dados = await AsyncStorage.getItem(`notificacoes_${userId}`);
        const lista: INotificacao[] = dados ? JSON.parse(dados) : [];

        setNotificacoes(lista.reverse()); // mais recentes primeiro
      } catch (error) {
        console.error('Erro ao carregar notificações:', error);
      } finally {
        setCarregando(false);
      }
    };

    carregarNotificacoes();
  }, []);

  const abrirNoMapa = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      {carregando ? (
        <ActivityIndicator size="large" color="#000" />
      ) : notificacoes.length > 0 ? notificacoesFiltradas.map(not => (
        <CardNotificacao
          key={not.id}
          notificacao={not}
          exibirBotoesGerenciamento={true}
          abrirNoMapa={abrirNoMapa}
          />
      ))
      : <Text style={styles.noNots}>Nenhuma notificação enviada ainda.</Text> }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: 
    { flex: 1,
      backgroundColor: '#fff'
    },
  noNots: {
    paddingVertical: 30,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold'
  },
});
