import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";

type AuthContextType = {
  userData: any;
  token: string | null;
  login: (values: { email: string; password: string }) => Promise<void>;
  register: (values: {
    username: string;
    email: string;
    password: string;
    city: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userData, setUserData] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const IPs = ["localhost", "10.10.187.67", "192.168.0.131", "10.0.2.129"];

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
            await AsyncStorage.removeItem("user");
          }
        }
      } catch (error) {
        // O log de erro foi removido daqui
      }
    };
    loadUser();
  }, []);

  const login = async (values: { email: string; password: string }) => {
    try {
      const response = await axios.post(
        `http://${IPs[3]}:8080/auth/login`,
        values
      );
      const { token, user } = response.data;
      setToken(token);
      setUserData(user);

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user || {}));

      if (user.role === "USER") {
        router.replace("/(user)/minhasNotificacoes");
      } else if (user.role === "PREFECTURE") {
        router.replace("/(prefeitura)/notificacaoPrefeitura");
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (values: {
    username: string;
    email: string;
    password: string;
    city: string;
  }) => {
    try {
      await axios.post(`http://${IPs[2]}:8080/auth/register/user`, values);
      router.push("../login");
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    setToken(null);
    setUserData(null);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.replace("/home");
  };

  return (
    <AuthContext.Provider value={{ userData, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
