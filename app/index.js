import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useTheme } from '../context/themeContext';

export default function Home() {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text, }]}>Bem-Vindo</Text>

            <TouchableOpacity style={styles.button}>
                <Link href={'/(auth)/login'} style={styles.link}>Login</Link>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
                <Link href={'/(auth)/cadastro'} style={styles.link}>Cadastro</Link>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 30,
    },
    link: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    button: {
        width: '50%',
        padding: 15,
        borderRadius: 8,
        backgroundColor: "#4f46e5",
        marginBottom: 15,
    },
});