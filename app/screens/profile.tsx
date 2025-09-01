import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'


export default function UserProfile() {
    const { userData, logout } = useContext(AuthContext)

    if (!userData) {
        return (
          <View style={styles.container}>
            <Text>Carregando...</Text>
          </View>
        );
      }
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <MaterialIcons name="person-outline" size={64} color="#000" />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>USUÁRIO</Text>
        <Text style={styles.value}>{userData.username || 'Desconhecido'}</Text>

        <Text style={styles.label}>EMAIL</Text>
        <Text style={styles.value}>{userData.email || 'Desconhecido'}</Text>

        <Text style={styles.label}>CIDADE</Text>
        <Text style={styles.value}>{userData.city || 'Desconhecida'}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => {logout()}}>
        <MaterialIcons name="logout" size={24} color="#000" />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F9',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  infoContainer: {
    alignItems: 'flex-start',
    width: '80%',
    gap: 12,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
  value: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
