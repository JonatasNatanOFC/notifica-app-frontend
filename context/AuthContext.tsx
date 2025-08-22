// context/AuthContext.tsx
import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";

type AuthContextType = {
  userData: any;
  token: string | null;
  login: (values: { email: string; password: string }) => Promise<void>;
  register: (values: { username: string; email: string; password: string; city: string }) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");
        if (storedToken && storedUser) {
          setToken(storedToken);
          try {
            const parsedUser = JSON.parse(storedUser);
            setUserData(parsedUser);
          } catch (e) {
            console.error("❌ Erro ao parsear usuário salvo:", e);
            await AsyncStorage.removeItem("user"); // limpa valor inválido
          }
        }
      } catch (error) {
        
      }
      
    };
    loadUser();
  }, []);

  const login = async (values: { email: string; password: string }) => {
    const response = await axios.post("http://localhost:8080/auth/login", values);
    if (response.status === 200) {
      const { token, user } = response.data;
      setToken(token);
      setUserData(user);
      
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user || {}));

      // Redirecionar pela role
      if (user.role === "USER") {
        router.replace("/(user)/minhasNotificacoes");
      } else if (user.role === "PREFECTURE") {
        router.replace("/(prefeitura)/notificacaoPrefeitura");
      }
    }
  };

  const register = async (values: { username: string; email: string; password: string; city: string }) => {
    await axios.post("http://localhost:8080/auth/register/user", values);
    // depois de registrar pode logar automaticamente ou mandar pra tela de login
    router.push("../login");
  };

  const logout = async () => {
    setToken(null);
    setUserData(null);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.replace("../screens/home");
  };

  return (
    <AuthContext.Provider value={{ userData, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
