import { Stack } from 'expo-router';
import { useTheme } from '../../context/themeContext';

export default function AuthLayout() {
    const { theme } = useTheme();

    return (
        <Stack screenOptions={{
            headerStyle: { backgroundColor: theme.card },
            headerTintColor: theme.text
        }}
        >
            <Stack.Screen
                name="cadastro"
                options={{ title: "Cadastro" }}
            />

            <Stack.Screen
                name="login"
                options={{ title: "Login" }}
            />
        </Stack>
    )
};