import { View, Text, TextInput, Alert, StyleSheet, Button } from 'react-native';
import { useState } from 'react';
import api from '../services/api';
import { useTheme} from '../../context/themeContext';


export default function Cadastro({ navigation }) {
    const { theme } = useTheme();

    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    async function handleCadastro() {
        try {
            await api.post("/auth/register", {
                nome: nome,
                email: email,
                senha: senha
            });

            Alert.alert("Sucesso", "Cadastro realizado!");
        } catch (err) {
            console.log(err.response?.data || err.message);
            Alert.alert(
                "Erro",
                JSON.stringify(err.response?.data || err.message)
            );
        }

    }

    return (
        <View style={styles.container}>

            <View style={[styles.content, { backgroundColor: theme.background }]}>
                <Text style={[styles.title, { color: theme.text }]}>Cadastro</Text>

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

                <Button title='Cadastrar' onPress={handleCadastro} />
            </View>

            <Text style={styles.aviso}>*Não utilize dados reais</Text>

        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ddddddff',
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
        width: '90%'
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