import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity,} from 'react-native';

export type ButtonProps={
  handleNavigation:()=> void;
}

export default function CreateNotificacaoBtn({handleNavigation}:ButtonProps){

  return(
    <View style={styles.container} >
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => handleNavigation()}
        activeOpacity={0.7}
      >
        <Text style={styles.text}>Criar</Text>
      </TouchableOpacity>
    </View>
  )
} 

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  button: {
    width: 80,
    height: 50,
    borderRadius: 10, 
    backgroundColor: '#002593ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24, 
    textAlign: 'center',         
    },
});

