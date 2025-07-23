import React from 'react';
import { View, Text,StyleSheet } from 'react-native';
import { router } from "expo-router";
import CreateNotificacaoBtn from '@/components/button/CreateNoticacaoBtn';



export default function Notificacao() {

    const handleNavigationCriarNotificacao = () =>{
        router.push("../screens/criarNotificacao")
    }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Nova Notificação</Text>
      <View style={styles.botoes}>
        <CreateNotificacaoBtn
            handleNavigation={()=> handleNavigationCriarNotificacao()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  botoes: { marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' },
});