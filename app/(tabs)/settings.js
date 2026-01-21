import { View, Text, Switch, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/themeContext';
import { useAuth } from '../../context/authContext';
import api from '../services/api';
import ChangePassModal from '../(auth)/components/ChangePassModal';

export default function Settings() {
    const { theme, darkMode, setDarkMode } = useTheme();
    const { user } = useAuth();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    async function handleLogout() {
        await AsyncStorage.removeItem("token");
        router.replace("/(auth)/login");
    }

    async function handleDeleteAccount() {
        await api.delete('/auth/delete');
        router.replace("/(auth)/login");
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>

            <View style={[styles.card, styles.row, { backgroundColor: theme.card }]}>
                <Text style={[styles.cardText, { color: theme.text }]}>
                    Tema escuro
                </Text>
                <Switch value={darkMode} onValueChange={setDarkMode} />
            </View>

            <View style={[styles.card, { backgroundColor: theme.card }]}>
                <Text style={[styles.label, { color: theme.text }]}>
                    Usuário: <Text style={[styles.value, { color: theme.text }]}>{user?.nome}</Text>
                </Text>

                <Text style={[styles.label, { color: theme.text }]}>
                    Email: <Text style={[styles.value, { color: theme.text }]}>{user?.email}</Text>
                </Text>

                <TouchableOpacity
                    style={styles.changePassButton}
                    onPress={() => setOpen(true)}
                >
                    <Text style={styles.changePassText}>Alterar senha</Text>
                </TouchableOpacity>
            </View>

            <ChangePassModal visible={open} onClose={() => setOpen(false)} />

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() =>
                        Alert.alert("Sair", "Deseja realmente sair?", [
                            { text: "Cancelar", style: "cancel" },
                            { text: "Sair", onPress: handleLogout },
                        ])
                    }
                >
                    <Text style={styles.footerText}>SAIR DA CONTA</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() =>
                        Alert.alert("Deletar", "Essa ação é irreversível", [
                            { text: "Cancelar", style: "cancel" },
                            { text: "Deletar", onPress: handleDeleteAccount, style: "destructive" },
                        ])
                    }
                >
                    <Text style={styles.footerText}>DELETAR CONTA</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        borderRadius: 6,
        padding: 14,
        marginBottom: 14,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardText: {
        fontSize: 16,
    },
    label: {
        fontSize: 17,
        marginBottom: 6,
    },
    value: {
        fontWeight: 'bold',
        color: '#fff',
    },
    changePassButton: {
        marginTop: 10,
        backgroundColor: '#fff',
        paddingVertical: 6,
        paddingHorizontal: 10,
        alignSelf: 'flex-start',
        borderRadius: 4,
    },
    changePassText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footer: {
        marginTop: 'auto',
        gap: 10,
    },
    logoutButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 4,
    },
    deleteButton: {
        backgroundColor: '#fb2222',
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 4,
    },
    footerText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});