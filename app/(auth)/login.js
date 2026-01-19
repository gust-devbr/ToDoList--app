import { View, Text, TextInput, Alert, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../../context/authContext';

export default function Login({ navigation }) {
    const { login } = useAuth();

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [redirecting, setRedirecting] = useState(false)

    async function handleLogin() {
        try {
            setRedirecting(true)

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

            setTimeout(() => {
                router.replace("/(tabs)/tasks");
            }, 800)

        } catch (err) {
            const message =
                err.response?.data?.error ||
                err.message ||
                "Email ou senha inválidos";

            setRedirecting(false);

            Alert.alert("Erro", message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Login</Text>

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

                {redirecting ? (
                    <>
                        <ActivityIndicator size="large" />
                        <Text style={{ textAlign: 'center' }}>
                            Login realizado! Redirecionando...
                        </Text>
                    </>
                ) : (
                    <Button title='Login' onPress={handleLogin} />
                )}
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