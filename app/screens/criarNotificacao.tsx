import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from "expo-router";

import { ILocalizacao } from '../../interfaces/ILocalizacao';
import { INotificacao } from '../../interfaces/INotificacao';

export default function CriarNotificacao() {
  const [descricao, setDescricao] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [localizacao, setLocalizacao] = useState<ILocalizacao | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [exibirBotaoLocalizacao, setExibirBotaoLocalizacao] = useState(false)
  const { NotId } = useLocalSearchParams();

  //Carrega o ID do usuario no AsyncStorage
  //Como ainda n existe o usuario cadastrado, estamos simulando um ID
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

  const getNotificacao = async () => {    
    const data = await AsyncStorage.getItem(`notificacoes_${userId}`)
    const notificacoes: INotificacao[] = data ? JSON.parse(data) : [];
    if (notificacoes){
      const notificacao = notificacoes.filter(not => not.id === NotId)
      setDescricao(notificacao[0].descricao)
      setFotoUrl(notificacao[0].fotoUrl)
      setLocalizacao(notificacao[0].localizacao)
      
    }
  }
 
  useEffect(() => {
    if (NotId){
      getNotificacao()
      return
    }
    pegarLocalizacao()
    
  },[userId])

  const tirarFoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão negada', 'Precisamos de acesso à câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      setFotoUrl(result.assets[0].uri);
    }
  };
  const escolherFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ base64: true });

    if (!result.canceled) {
      setFotoUrl(result.assets[0].uri);
    }
  };

  //Pegar localização do Usuario
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
      cidade: reverse[0].city || reverse[0].subregion,
      bairro: reverse[0].district,
      rua: reverse[0].street
    });
  };

  const enviarNotificacao = async () => {
    if (!descricao || !fotoUrl || !localizacao) {
      Alert.alert('Preencha todos os campos!');
      setExibirBotaoLocalizacao(true)
      return;
    }
    const chave = `notificacoes_${userId}`;

    if (NotId) {
      const data = await AsyncStorage.getItem(`notificacoes_${userId}`)
      const notificacoes: INotificacao[] = data ? JSON.parse(data) : [];
      const notificacoesAtualizadas = notificacoes.map(not =>
        not.id === NotId ? {
          ...not,
          fotoUrl,
          descricao,
        } : not
      )

      await AsyncStorage.setItem(chave, JSON.stringify(notificacoesAtualizadas));
      Alert.alert('Edição realizada com sucesso!');
    } else {
      const novaNotificacao: INotificacao = {
        id: Date.now().toString(),
        userId,
        descricao,
        fotoUrl,
        localizacao,
        dataEnvio: new Date().toISOString(),
        status: 'pendente',
      };
      const notificacoesAntigas = await AsyncStorage.getItem(chave);
      const notificacoes: INotificacao[] = notificacoesAntigas ? JSON.parse(notificacoesAntigas) : [];
      notificacoes.push(novaNotificacao);
      await AsyncStorage.setItem(chave, JSON.stringify(notificacoes));
      Alert.alert('Enviado com sucesso!');
    }

    setDescricao('');
    setFotoUrl('');
    setLocalizacao(null);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{NotId ? 'Editar Notificação' : 'Criar Notificação'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Descrição"
        placeholderTextColor={'#4d4d4dff'}
        value={descricao}
        onChangeText={setDescricao}
      />

      <Button title={fotoUrl ? 'Alterar Foto' : 'Adicionar Foto'} onPress={() => {
        Alert.alert(
          'Foto',
          'Como deseja adicionar a foto?',
          [
            { text: 'Tirar agora', onPress: tirarFoto },
            { text: 'Escolher da galeria', onPress: escolherFoto },
            { text: 'Cancelar', style: 'cancel' },
          ]
        );
      }} />
      {fotoUrl !== '' && <Image source={{ uri: fotoUrl }} style={styles.imagem} />}

      {exibirBotaoLocalizacao &&
        <Button title="Usar Localização Atual" onPress={pegarLocalizacao} />
      }
      {localizacao && (
        <Text style={styles.local}>
          📍 {localizacao.cidade} ({localizacao.latitude.toFixed(3)}, {localizacao.longitude.toFixed(3)})
        </Text>
      )}

      <View style={styles.botoes}>
        <Button title={NotId ? 'Salvar' : 'Enviar'} onPress={enviarNotificacao} />
        <Button title="Cancelar" onPress={() => {router.back()}} color="#777" />
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