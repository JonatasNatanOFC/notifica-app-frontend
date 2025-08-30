import React, { useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { FontAwesome } from "@expo/vector-icons";

import { ILocalizacao } from "@/interfaces/ILocalizacao";
import { INotificacao } from "@/interfaces/INotificacao";
import { AuthContext } from "@/context/AuthContext";

type ModalProps = {
  visible: boolean;
  id?: number;
  onClose: () => void;
  onSave: () => void;
};

export default function ModalCriarNotificacao({
  visible,
  id,
  onClose,
  onSave,
}: ModalProps) {
  const [descricao, setDescricao] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [localizacao, setLocalizacao] = useState<ILocalizacao | null>(null);
  const [userId, setUserId] = useState<string>("");
  const { userData } = useContext(AuthContext);

  
  useEffect(() => {
    if (visible && userId && id) {
      loadNotData(id);
    } else {
      resetForm();
    }
  }, [visible, userId, id]);

  const loadNotData = async (notId: number) => {
    const chave = `notificacoes_${userId}`;
    try {
      const data = await AsyncStorage.getItem(chave);
      const notList: INotificacao[] = data ? JSON.parse(data) : [];

      
      const notData = notList.find((not) => not.id === notId.toString());

      if (notData) {
        setDescricao(notData.descricao);
        setFotoUrl(notData.fotoUrl);
        setLocalizacao(notData.localizacao);
      }
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    }
  };

  
  useEffect(() => {
    if (visible) {
      const inicializarUserId = async () => {
        const idExistente = await AsyncStorage.getItem("userId");
        if (idExistente) {
          setUserId(idExistente);
        } else {
          const novoId = Date.now().toString();
          await AsyncStorage.setItem("userId", novoId);
          setUserId(novoId);
        }
      };
      inicializarUserId();
      pegarLocalizacao();
    }
  }, [visible]);

  const resetForm = () => {
    setDescricao("");
    setFotoUrl("");
    setLocalizacao(null);
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
      setFotoUrl(result.assets[0].uri);
    }
  };

  const escolherFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({});
    if (!result.canceled) {
      setFotoUrl(result.assets[0].uri);
    }
  };

  const pegarLocalizacao = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "Permita acesso à localização.");
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    const reverse = await Location.reverseGeocodeAsync(location.coords);
    setLocalizacao({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      cidade: reverse[0].city || reverse[0].subregion,
      bairro: reverse[0].district,
      rua: reverse[0].street,
    });
  };

  const enviarNotificacao = async () => {
    if (!descricao || !fotoUrl || !localizacao) {
      Alert.alert("Atenção", "Descrição e foto são obrigatórias.");
      return;
    }
    const chave = `notificacoes_${userId}`;
    const novaNotificacao: INotificacao = {
      id: Date.now().toString(),
      username: userData.username,
      userId,
      descricao,
      fotoUrl,
      localizacao,
      dataEnvio: new Date().toISOString(),
      status: "pendente",
    };

    const notificacoesAntigas = await AsyncStorage.getItem(chave);
    const notificacoes: INotificacao[] = notificacoesAntigas
      ? JSON.parse(notificacoesAntigas)
      : [];

    if (id) {
      const index = notificacoes.findIndex((not) => not.id === id.toString());
      if (index !== -1) {
        notificacoes[index] = { ...notificacoes[index], ...novaNotificacao };
      }
    } else {
      notificacoes.push(novaNotificacao);
    }

    await AsyncStorage.setItem(chave, JSON.stringify(notificacoes));
    Alert.alert("Sucesso!", id ? "Notificação atualizada." : "Notificação enviada.");
    onSave();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <View style={styles.modalHeader}>
              <Text style={styles.titulo}>
                {id ? "Editar Notificação" : "Criar Notificação"}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <FontAwesome name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Descreva o problema aqui..."
              placeholderTextColor={"#888"}
              value={descricao}
              onChangeText={setDescricao}
              multiline
            />
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
              {fotoUrl ? (
                <Image source={{ uri: fotoUrl }} style={styles.imagem} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <FontAwesome name="camera" size={40} color="#ccc" />
                  <Text style={styles.imagePlaceholderText}>
                    Toque para adicionar uma foto
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            {localizacao && (
              <Text style={styles.local}>
                📍 {localizacao.rua}, {localizacao.bairro} -{" "}
                {localizacao.cidade}
              </Text>
            )}
            <View style={styles.botoes}>
              <Button title={id ? "Atualizar Notificação" : "Enviar Notificação"} onPress={enviarNotificacao} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titulo: { fontSize: 22, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 100,
  },
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
  imagem: { width: "100%", height: "100%" },
  imagePlaceholder: {
    alignItems: "center",
  },
  imagePlaceholderText: {
    color: "#aaa",
    marginTop: 10,
  },
  local: {
    marginVertical: 10,
    fontStyle: "italic",
    color: "#555",
    textAlign: "center",
  },
  botoes: { marginTop: 10 },
});
