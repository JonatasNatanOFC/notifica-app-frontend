import { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const { register } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuário"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Cidade"
        placeholderTextColor="#aaa"
        value={city}
        onChangeText={setCity}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => register({ username, email, password, city })}
      >
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    paddingHorizontal: 15,
    color: "#fff",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    backgroundColor: "#2196F3",
    paddingVertical: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
