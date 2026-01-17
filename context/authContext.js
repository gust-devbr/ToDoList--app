import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../app/services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            const storedUser = await AsyncStorage.getItem("@user");
            const token = await AsyncStorage.getItem("@token");

            if (storedUser && token) {
                api.defaults.headers.common.Authorization = `Bearer ${token}`;
                setUser(JSON.parse(storedUser));
            }

            setLoading(false);
        }

        loadUser();
    }, []);

    async function login({ token, user }) {
        await AsyncStorage.setItem("@token", token);
        await AsyncStorage.setItem("@user", JSON.stringify(user));

        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        setUser(user);
    }

    async function logout() {
        await AsyncStorage.multiRemove(["@token", "@user"]);
        setUser(null);
    }

    async function deleteAccount() {
        await api.delete("/auth/delete");
        await logout();
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                deleteAccount,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth deve ser usado dentro do AuthProvider");
    }

    return context;
}
