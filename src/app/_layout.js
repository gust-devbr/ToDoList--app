import { Stack } from 'expo-router';
import { ThemeProvider } from '../context/themeContext';
import { AuthProvider } from '../context/authContext';

export default function RootLayout() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Stack screenOptions={{ headerShown: false }} />
            </AuthProvider>
        </ThemeProvider>
    )
};