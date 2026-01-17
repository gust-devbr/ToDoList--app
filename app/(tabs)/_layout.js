import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useTheme } from "../../context/themeContext";
import { useAuth } from "../../context/authContext";
import { FontAwesome } from '@expo/vector-icons';

export default function TabsLayout() {
    const { theme } = useTheme();
    const { user } = useAuth();

    return (
        <Tabs screenOptions={{
            headerStyle: { backgroundColor: theme.card },
            headerTintColor: theme.text,
            tabBarStyle: { backgroundColor: theme.card },
            tabBarActiveTintColor: theme.primary,
        }}
        >
            <Tabs.Screen
                name="tasks"
                options={{
                    title: "Tarefas",
                    headerTitle: () => (
                        <Text style={{ color: theme.text, fontSize: 16 }}>
                            Olá, ${user?.nome}
                        </Text>
                    ),
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="list" size={size} color={color} />
                    )
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    title: "Configurações",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="cog" size={size} color={color} />
                    )
                }}
            />
        </Tabs>
    )
};