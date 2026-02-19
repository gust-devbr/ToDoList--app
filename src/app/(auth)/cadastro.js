import { View, Text, TextInput, Alert, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import api from '../services/api';

export default function Cadastro({ navigation }) {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [redirecting, setRedirecting] = useState(false)

    async function handleCadastro() {
        try {
            setRedirecting(true)

            await api.post("/auth/register", {
                nome: nome,
                email: email,
                senha: senha
            });

            Alert.alert("Sucesso", "Cadastro realizado!");

            setTimeout(() => {
                router.replace("/login");
            }, 800)

        } catch (err) {
            setRedirecting(false);
            Alert.alert("Erro", "Erro ao cadastrar");
        }

    };

    const isDisabled = !nome || !email || !senha;

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Cadastro</Text>

                <TextInput
                    style={styles.input}
                    placeholder='Nome'
                    value={nome}
                    onChangeText={setNome}
                />

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
                            Cadastro realizado! Redirecionando para login...
                        </Text>
                    </>
                ) : (
                    <Button disabled={isDisabled} title='Cadastrar' onPress={handleCadastro} />
                )}
            </View>

            <Text style={styles.aviso}>*Não utilize dados reais</Text>
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
    aviso: {
        color: 'red',
        marginTop: 8,
        fontSize: 16,
    },
});