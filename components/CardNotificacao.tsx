import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { INotificacao } from "@/interfaces/INotificacao";
import { ILocalizacao } from "@/interfaces/ILocalizacao";
import ModalConfirmacao from "./hooks/ModalConfirmacao";
import { router } from "expo-router";

type cardProps = {
  notificacao: INotificacao;
  exibirBotoesGerenciamento: boolean;
  abrirNoMapa: (latitude: number, longitude: number) => void;
  id?: number;
  onDelete?: (id: number) => void;
  onAtualizarStatus?: (
    id: string,
    novoStatus: "pendente" | "resolvido" | "análise"
  ) => void;
  onResponder?: () => void;
};

export type StatusColorProps = {
  [status: string]: {
    backgroundColor: string;
    textColor: string;
  };
};

export const statusColors: StatusColorProps = {
  pendente: {
    backgroundColor: "#ffe5b4",
    textColor: "#b36b00",
  },
  resolvido: {
    backgroundColor: "#e0f2e9",
    textColor: "#388e3c",
  },
  análise: {
    backgroundColor: "#e0e0ff",
    textColor: "#303f9f",
  },
};

export function formatarData(dataEnvio: string): string {
  const data = new Date(dataEnvio);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  const horas = String(data.getHours()).padStart(2, "0");
  const minutos = String(data.getMinutes()).padStart(2, "0");
  return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
}

export function formatarLocalizacao(localizacao: ILocalizacao): string {
  const parts = [];
  if (localizacao.rua) parts.push(localizacao.rua);
  if (localizacao.bairro) parts.push(localizacao.bairro);
  const ruaBairro = parts.join(", ");
  if (localizacao.cidade) {
    return ruaBairro
      ? `${ruaBairro} - ${localizacao.cidade}`
      : localizacao.cidade;
  }
  return ruaBairro;
}

export default function NotificationCard({
  notificacao,
  exibirBotoesGerenciamento,
  abrirNoMapa,
  id,
  onDelete,
  onAtualizarStatus,
  onResponder,
}: cardProps) {
  const colors = statusColors[notificacao.status.toLowerCase()] || {
    backgroundColor: "#eee",
    textColor: "#333",
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);

  const handleDelete = () => {
    if (id && onDelete) {
      onDelete(id);
    }
  };

  const handleEdit = () => {
    if (id) {
      router.push({
        pathname: "/screens/criarNotificacao",
        params: { NotId: id },
      });
    }
  };

  const alterarStatus = (novoStatus: "pendente" | "resolvido" | "análise") => {
    if (onAtualizarStatus) {
      onAtualizarStatus(notificacao.id, novoStatus);
    }
    setStatusMenuVisible(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <FontAwesome name="map-marker" size={20} color="#ff5733" />
        <Text style={styles.location} numberOfLines={1} ellipsizeMode="tail">
          {formatarLocalizacao(notificacao.localizacao)}
        </Text>
      </View>

      <Text style={styles.date}>
        Enviado em: {formatarData(notificacao.dataEnvio)}
      </Text>

      <View style={styles.content}>
        {notificacao.fotoUrl && (
          <Image source={{ uri: notificacao.fotoUrl }} style={styles.image} />
        )}
        <View style={styles.textContent}>
          <Text style={styles.description}>{notificacao.descricao}</Text>
          <Text style={styles.user}>Usuário: {notificacao.userId}</Text>
          <View
            style={[
              styles.statusContainer,
              { backgroundColor: colors.backgroundColor },
            ]}
          >
            <Text style={[styles.status, { color: colors.textColor }]}>
              {notificacao.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            abrirNoMapa(
              notificacao.localizacao.latitude,
              notificacao.localizacao.longitude
            )
          }
        >
          <MaterialIcons name="map" size={18} color="#444" />
          <Text style={styles.actionText}>Ver no mapa</Text>
        </TouchableOpacity>

        {!exibirBotoesGerenciamento && notificacao.status === "pendente" && (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setModalVisible(true)}
            >
              <MaterialIcons name="delete" size={18} color="#d32f2f" />
              <Text style={styles.actionText}>Excluir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
              <MaterialIcons name="edit" size={18} color="#303f9f" />
              <Text style={styles.actionText}>Editar</Text>
            </TouchableOpacity>
          </>
        )}

        {exibirBotoesGerenciamento && (
          <>
            {onResponder && !notificacao.respostaPrefeitura && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onResponder}
              >
                <MaterialIcons name="reply" size={18} color="#444" />
                <Text style={styles.actionText}>Responder</Text>
              </TouchableOpacity>
            )}
            {notificacao.respostaPrefeitura && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setMostrarDetalhes((prev) => !prev)}
              >
                <MaterialIcons name="info" size={18} color="#444" />
                <Text style={styles.actionText}>
                  {mostrarDetalhes ? "Ocultar resposta" : "Ver resposta"}
                </Text>
              </TouchableOpacity>
            )}
            {onAtualizarStatus && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setStatusMenuVisible(true)}
              >
                <MaterialIcons name="update" size={18} color="#444" />
                <Text style={styles.actionText}>Alterar status</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      <Modal
        transparent
        visible={statusMenuVisible}
        animationType="fade"
        onRequestClose={() => setStatusMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setStatusMenuVisible(false)}
        >
          <View style={styles.modalContent}>
            {["pendente", "análise", "resolvido"].map((status) => (
              <TouchableOpacity
                key={status}
                style={styles.modalButton}
                onPress={() =>
                  alterarStatus(status as "pendente" | "resolvido" | "análise")
                }
              >
                <Text style={styles.modalButtonText}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      <ModalConfirmacao
        visible={modalVisible}
        message="Deseja realmente excluir esta notificação?"
        onConfirm={() => {
          handleDelete();
          setModalVisible(false);
        }}
        onCancel={() => setModalVisible(false)}
      />

      {mostrarDetalhes && notificacao.respostaPrefeitura && (
        <View style={styles.respostaContainer}>
          <Text style={styles.respostaTitulo}>Resposta da Prefeitura:</Text>
          <Text style={styles.respostaTexto}>
            {notificacao.respostaPrefeitura}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  location: {
    marginLeft: 8,
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginBottom: 12,
  },
  content: {
    flexDirection: "row",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#e0e0e0",
  },
  textContent: {
    flex: 1,
    justifyContent: "center",
  },
  description: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
  },
  user: {
    fontSize: 13,
    color: "#555",
    fontStyle: "italic",
    marginBottom: 8,
  },
  statusContainer: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  status: {
    fontWeight: "bold",
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
    flexWrap: "wrap",
    gap: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    backgroundColor: "#f9f9f9",
  },
  actionText: {
    marginLeft: 6,
    color: "#333",
    fontSize: 13,
    fontWeight: "500",
  },
  respostaContainer: {
    marginTop: 12,
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    borderColor: "#e0e0e0",
    borderWidth: 1,
  },
  respostaTitulo: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
    color: "#444",
  },
  respostaTexto: {
    fontSize: 13,
    color: "#333",
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    width: 250,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalButtonText: {
    fontSize: 16,
    textAlign: "center",
    color: "#303f9f",
    fontWeight: "500",
  },
});
