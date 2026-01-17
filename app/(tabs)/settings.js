import { View, Text, Switch, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/themeContext';
import api from '../services/api'

export default function Settings() {
    const { theme, darkMode, setDarkMode } = useTheme();
    const router = useRouter();


    async function handleLogout() {
        try {
            await AsyncStorage.removeItem("token");
            router.replace("/(auth)/login");
        } catch (err) {
            Alert.alert("Erro", "Não foi possível sair");
        }
    }

    async function handleDeleteAccount() {
        try {
            await api.delete('/auth/delete');
            router.replace("/(auth)/login")
        } catch (err) {
            Alert.alert("Erro", "Não foi possível apagar conta");
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.background, padding: 20 }}>

            <View style={{ marginBottom: 30 }}>
                <Text style={{ color: theme.text, fontSize: 18 }}>
                    Tema escuro
                </Text>
                <Switch value={darkMode} onValueChange={(value) => setDarkMode(value)} />
            </View>

            <Button
                title="Sair da conta"
                onPress={() =>
                    Alert.alert(
                        "Sair",
                        "Deseja realmente sair?",
                        [
                            { text: "Cancelar", style: "cancel" },
                            { text: "Sair", onPress: handleLogout },
                        ]
                    )
                }
            />

            <Button
                title="Apagar conta"
                onPress={() =>
                    Alert.alert(
                        "Apagar",
                        "Essa ação é irreversível. Deseja continuar?",
                        [
                            { text: "Cancelar", style: "cancel" },
                            { text: "Apagar", onPress: handleDeleteAccount, style: "destructive" }
                        ]
                    )
                }
            />
        </View>
    );
};