import { Stack } from 'expo-router';

export default function AuthLayout() {

    return (
        <Stack screenOptions={{
            headerStyle: { backgroundColor: "#F3F4F6" },
            headerTintColor: "#000",
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