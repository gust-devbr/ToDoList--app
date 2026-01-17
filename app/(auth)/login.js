import { View, Text, TextInput, Alert, StyleSheet, Button } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/themeContext';
import { useAuth } from '../../context/authContext';

export default function Login({ navigation }) {
    const { theme } = useTheme();
    const { login } = useAuth();

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    async function handleLogin() {
        try {
            const res = await api.post("/auth/login", {
                email,   
                senha
            });

            if (!res.data || !res.data.token || !res.data.nome) {
                throw new Error("Resposta inválida do servidor");
            };

            await login({ 
                token: res.data.token,
                user: {
                    nome: res.data.nome,
                }
            });

            router.replace("/(tabs)/tasks");

        } catch (err) {
            const message =
                err.response?.data?.error ||
                err.message ||
                "Email ou senha inválidos";

            Alert.alert("Erro", message);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>

            <View style={[styles.content, { backgroundColor: theme.content }]}>
                <Text style={[styles.title, { color: theme.text }]}>Login</Text>


                <TextInput
                    style={styles.input}
                    placeholder='Email'
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    style={styles.input}
                    placeholder='Senha'
                    value={senha}
                    onChangeText={setSenha}
                />

                <Button title='Login' onPress={handleLogin} />
            </View>

        </View>
    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        marginBottom: 10,
    },
    content: {
        padding: 20,
        borderRadius: 10,
        width: '90%',
        borderWidth: 1,
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        padding: 5,
        fontSize: 17,
    },
});