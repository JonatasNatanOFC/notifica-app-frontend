import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { FontAwesome, MaterialIcons } from '@expo/vector-icons'

type cardProps = {
  location: string
  createdAt: string
  image: string
  description: string
  user: string
  status: string
}

export type StatusColorProps = {
  [status: string]: {
    backgroundColor: string
    textColor: string
  }
}

export const statusColors: StatusColorProps = {
  'Pendente': {
    backgroundColor: '#ffe5b4',
    textColor: '#b36b00'
  },
  'Resolvido': {
    backgroundColor: '#e0f2e9',
    textColor: '#388e3c'
  },
}

export default function NotificationCard({location, createdAt, image, description, user, status}: cardProps) {
  const colors = statusColors[status] || {
    backgroundColor: '#eee',
    textColor: '#333',
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <FontAwesome name="map-marker" size={20} color="#ff5733" />
        <Text style={styles.location}>{location}</Text>
      </View>

      <Text style={styles.date}>Enviado em: {createdAt}</Text>

      <View style={styles.content}>
        <Image source={{ uri: image }} style={styles.image} />

        <View style={styles.textContent}>
          <Text style={styles.description}>Descrição: {description}</Text>
          <Text style={styles.user}>Usuário: {user}</Text>

          <View style={[styles.statusContainer, {backgroundColor: colors.backgroundColor}]}>
            <Text style={[styles.status, {color: colors.textColor}]}>{status}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="map" size={18} color="#444" />
          <Text style={styles.actionText}>Ver no mapa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="reply" size={18} color="#444" />
          <Text style={styles.actionText}>Responder</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="check" size={18} color="#444" />
          <Text style={styles.actionText}>Marcar como {'\n'}resolvido</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    margin: 20,
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
    width: 80,
    height: 80,
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