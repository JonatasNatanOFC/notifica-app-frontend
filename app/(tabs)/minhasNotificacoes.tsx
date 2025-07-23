import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator, Image
} from 'react-native';
import { Linking, TouchableOpacity } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { INotificacao } from '../../interfaces/INotificacao';

export default function MinhasNotificacoes() {
  const [notificacoes, setNotificacoes] = useState<INotificacao[]>([]);
  const [carregando, setCarregando] = useState(true);

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

  const renderItem = ({ item }: { item: INotificacao }) => (
    <View style={[styles.card, item.status === 'resolvido' && styles.resolvido]}>
      {item.fotoUrl && (
        <Image source={{ uri: item.fotoUrl }} style={styles.imagem} resizeMode="cover" />
      )}
      <Text style={styles.titulo}>{item.descricao}</Text>
      <Text style={styles.texto}>📍 {item.localizacao.cidade}</Text>
      <Text style={styles.texto}>📅 {new Date(item.dataEnvio).toLocaleDateString()}</Text>
      <Text style={styles.texto}>
        Status: {item.status === 'pendente' ? '⌛ Pendente' : '✅ Resolvido'}
      </Text>
      {item.respostaPrefeitura && (
        <Text style={styles.resposta}>📩 Resposta: {item.respostaPrefeitura}</Text>
      )}
      <TouchableOpacity
        onPress={() => abrirNoMapa(item.localizacao.latitude, item.localizacao.longitude)}
        style={styles.botaoMapa}
        >
        <Text style={styles.textoMapa}>🗺️ Ver no mapa</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Minhas Notificações</Text>
      {carregando ? (
        <ActivityIndicator size="large" color="#000" />
      ) : notificacoes.length === 0 ? (
        <Text>Nenhuma notificação enviada ainda.</Text>
      ) : (
        <FlatList
          data={notificacoes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginBottom: 16,
    elevation: 2,
  },
  resolvido: {
    backgroundColor: '#d4f3e5',
  },
  imagem: {
    width: '100%',
    height: 180,
    borderRadius: 6,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  texto: {
    fontSize: 14,
    marginBottom: 2,
  },
  resposta: {
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
    color: '#333',
  },
  botaoMapa: {
  marginTop: 8,
  backgroundColor: '#e0f0ff',
  padding: 8,
  borderRadius: 6,
  alignItems: 'center',
  },
  textoMapa: {
    color: '#0077cc',
    fontWeight: 'bold',
    }
});
