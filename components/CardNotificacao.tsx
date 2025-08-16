import React, { useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { INotificacao } from '@/interfaces/INotificacao'
import { ILocalizacao } from '@/interfaces/ILocalizacao'

import ModalConfirmacao from './hooks/ModalConfirmacao'

type cardProps = {
  notificacao: INotificacao
  exibirBotoesGerenciamento: boolean
  abrirNoMapa: (latitude: number, longitude: number) => void
  id?: number
  onDelete?: (id: number) => void
}

export type StatusColorProps = {
  [status: string]: {
    backgroundColor: string
    textColor: string
  }
}

export const statusColors: StatusColorProps = {
  'pendente': {
    backgroundColor: '#ffe5b4',
    textColor: '#b36b00'
  },
  'resolvido': {
    backgroundColor: '#e0f2e9',
    textColor: '#388e3c'
  },
}

export function formatarData(dataEnvio: string): string {
  const data = new Date(dataEnvio)

  const dia = String(data.getDate()).padStart(2, '0')
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const ano = data.getFullYear()

  const horas = String(data.getHours()).padStart(2, '0')
  const minutos = String(data.getMinutes()).padStart(2, '0')

  return `${dia}/${mes}/${ano} às ${horas}:${minutos}`
}

export function formatarLocalizacao(localizacao: ILocalizacao): string {
  var local = ''
  if (localizacao.rua) {local = localizacao.rua}
  if (localizacao.bairro) {local = local + `, ${localizacao.bairro}`}
  if (localizacao.cidade) {local = local + ` - ${localizacao.cidade}`}

  return local
}

export default function NotificationCard({notificacao, exibirBotoesGerenciamento, abrirNoMapa, id, onDelete}: cardProps) {
  const colors = statusColors[notificacao.status.toLocaleLowerCase()] || {
    backgroundColor: '#eee',
    textColor: '#333',
  }
  const [modalVisible, setModalVisible] = useState(false)
  
  const handleDelete = () => {
    if (id && onDelete){
      onDelete(id)
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <FontAwesome name="map-marker" size={20} color="#ff5733" />
        <Text style={styles.location}>{formatarLocalizacao(notificacao.localizacao)}</Text>
      </View>

      <Text style={styles.date}>Enviado em: {formatarData(notificacao.dataEnvio)}</Text>

      <View style={styles.content}>
        <Image source={{ uri: notificacao.fotoUrl }} style={styles.image} />

        <View style={styles.textContent}>
          <Text style={styles.description}>Descrição: {notificacao.descricao}</Text>
          <Text style={styles.user}>Usuário: {notificacao.userId}</Text>

          <View style={[styles.statusContainer, {backgroundColor: colors.backgroundColor}]}>
            <Text style={[styles.status, {color: colors.textColor}]}>{notificacao.status.toLocaleUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} 
          onPress={() => abrirNoMapa(notificacao.localizacao.latitude, notificacao.localizacao.longitude)}
        >
          <MaterialIcons name="map" size={18} color="#444" />
          <Text style={styles.actionText}>Ver no mapa</Text>
        </TouchableOpacity>

        {!exibirBotoesGerenciamento &&
          <TouchableOpacity style={styles.actionButton} 
          onPress={() => setModalVisible(true)}
          >
            <MaterialIcons name="delete" size={18} color="#444" />
            <Text style={styles.actionText}>Excluir</Text>
          </TouchableOpacity>
        }

        {exibirBotoesGerenciamento &&
          <>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="reply" size={18} color="#444" />
              <Text style={styles.actionText}>Responder</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="check" size={18} color="#444" />
              <Text style={styles.actionText}>Marcar como {'\n'}resolvido</Text>
            </TouchableOpacity>
          </>  
        }

        <ModalConfirmacao
          visible={modalVisible}
          message="Deseja excluir está denúncia?"
          onConfirm={() => {
            handleDelete();
            setModalVisible(false);
          }}
          onCancel={() => setModalVisible(false)}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 10,
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  location: {
    marginLeft: 6,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  content: {
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 6,
    marginRight: 10,
  },
  textContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  description: {
    fontSize: 14,
    color: '#333',
  },
  user: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
  statusContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
  },
  status: {
    fontWeight: '600',
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 16,
    flexWrap: 'wrap',
    gap: 15
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  actionText: {
    marginLeft: 4,
    color: '#444',
    fontSize: 13,
  }
})