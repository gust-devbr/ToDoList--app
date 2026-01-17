import { createContext, useContext, useState } from "react";
import api from "../app/services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    async function login({ token, user }) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        setUser(user);
    }

    async function logout() {
        api.defaults.headers.common.Authorization = null;
        setUser(null);
    }

    async function deleteAccount() {
        await api.delete("/auth/delete");
        await logout();
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, deleteAccount}}>
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
