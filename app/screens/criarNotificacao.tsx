import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { router } from "expo-router";

import { ILocalizacao } from '../../interfaces/ILocalizacao';
import { INotificacao } from '../../interfaces/INotificacao';

export default function CriarNotificacao() {
  const [descricao, setDescricao] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [localizacao, setLocalizacao] = useState<ILocalizacao | null>(null);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const inicializarUserId = async () => {
      const idExistente = await AsyncStorage.getItem('userId');
      if (idExistente) {
        setUserId(idExistente);
      } else {
        const novoId = Date.now().toString();
        await AsyncStorage.setItem('userId', novoId);
        setUserId(novoId);
      }
    };
    inicializarUserId();
  }, []);

  const escolherFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ base64: true });

    if (!result.canceled) {
      setFotoUrl(result.assets[0].uri);
    }
  };

  const pegarLocalizacao = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Permita acesso à localização.');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const reverse = await Location.reverseGeocodeAsync(location.coords);

    setLocalizacao({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      cidade: reverse[0].city || 'Desconhecida',
    });
  };

  const enviarNotificacao = async () => {
    if (!descricao || !fotoUrl || !localizacao) {
      Alert.alert('Preencha todos os campos!');
      return;
    }

    const novaNotificacao: INotificacao = {
      id: Date.now().toString(),
      userId,
      descricao,
      fotoUrl,
      localizacao,
      dataEnvio: new Date().toISOString(),
      status: 'pendente',
    };

    const chave = `notificacoes_${userId}`;
    const notificacoesAntigas = await AsyncStorage.getItem(chave);
    const notificacoes: INotificacao[] = notificacoesAntigas ? JSON.parse(notificacoesAntigas) : [];
    notificacoes.push(novaNotificacao);
    await AsyncStorage.setItem(chave, JSON.stringify(notificacoes));

    Alert.alert('Enviado com sucesso!');
    setDescricao('');
    setFotoUrl('');
    setLocalizacao(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Criar Notificação</Text>

      <TextInput
        style={styles.input}
        placeholder="Descrição"
        placeholderTextColor={'#4d4d4dff'}
        value={descricao}
        onChangeText={setDescricao}
      />

      <Button title="Escolher Foto" onPress={escolherFoto} />
      {fotoUrl !== '' && <Image source={{ uri: fotoUrl }} style={styles.imagem} />}

      <Button title="Usar Localização Atual" onPress={pegarLocalizacao} />
      {localizacao && (
        <Text style={styles.local}>
          📍 {localizacao.cidade} ({localizacao.latitude.toFixed(3)}, {localizacao.longitude.toFixed(3)})
        </Text>
      )}

      <View style={styles.botoes}>
        <Button title="Enviar" onPress={enviarNotificacao} />
        <Button title="Cancelar" onPress={() => {router.replace("../notificacao")}} color="#777" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 2, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius:10 },
  imagem: { width: '100%', height: 200, marginVertical: 10 },
  local: { marginVertical: 10, fontStyle: 'italic' },
  botoes: { marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' },
});