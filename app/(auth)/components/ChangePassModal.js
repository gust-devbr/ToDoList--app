import { View, Alert, Modal, TextInput, StyleSheet, Button } from 'react-native';
import { useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../../context/authContext';
import { router } from 'expo-router';

export default function ChangePassModal({ visible, onClose }) {
    const [atualSenha, setAtualSenha] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const { logout } = useAuth();

    async function handleChangePassword() {
        if (novaSenha !== confirmarSenha) {
            Alert.alert("Erro", "As senhas não coincidem");
            return;
        }

        try {
            await api.put("/auth/change-pass", { atualSenha: atualSenha, novaSenha: novaSenha });
            
            Alert.alert("Sucesso", "Sua senha foi alterada");
            setAtualSenha("");
            setNovaSenha("");
            setConfirmarSenha("");

            await logout();
            router.replace("/login")

        } catch (err) {
            console.log(err)
            Alert.alert("Erro", err.response?.data?.error || "Erro ao mudar senha");
        }
    }

    return (
        <Modal visible={visible} transparent animationType='slide'>
            <View style={styles.modalBackground}>
                <View style={styles.modal}>

                    <TextInput
                        style={styles.input}
                        placeholder='Senha atual:'
                        onChangeText={setAtualSenha}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Nova senha:'
                        onChangeText={setNovaSenha}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Confirmar nova senha:'
                        onChangeText={setConfirmarSenha}
                    />

                    <Button title='Salvar' onPress={handleChangePassword} />
                    <Button title='Cancelar' color='red' onPress={onClose} />
                </View>
            </View>
        </Modal>
    )
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modal: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        padding: 10,
        borderRadius: 5
    },
})