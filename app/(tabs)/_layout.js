import { Tabs } from "expo-router";
import { useTheme } from "../../context/themeContext";
import { FontAwesome } from '@expo/vector-icons';
import Foundation from '@expo/vector-icons/Foundation';

export default function TabsLayout() {
    const { theme } = useTheme();

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
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="list" size={size} color={color} />
                    )
                }}
            />

            <Tabs.Screen
                name="notes"
                options={{
                    title: "Notas",
                    tabBarIcon: ({ color, size }) => (
                        <Foundation name="clipboard-notes" size={size} color={color} />
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