import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from "../../context/themeContext";

export default function ContactList({ data, open, deleteItem }) {
    const { theme } = useTheme();
    const safeData = Array.isArray(data) ? data : [];

    return (
        <FlatList
            style={{ marginTop: 20 }}
            data={safeData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.item}>

                    <View style={styles.container}>
                        <Text style={[styles.name, { color: theme.text }]}>
                            {item.name ?? ""}
                        </Text>

                        <View style={styles.content}>
                            <Text style={{ color: theme.text, fontSize: 16 }}>
                                {item.email ?? ""}
                            </Text>

                            <Text style={{ color: theme.text, fontSize: 16 }}>
                                {item.tel ?? ""}
                            </Text>

                            <Text style={{ color: theme.text, fontSize: 16 }}>
                                {item.category ?? ""}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.actions}>
                        <TouchableOpacity onPress={() => open(item)}>
                            <FontAwesome
                                style={styles.actionIcons}
                                name="pencil"
                                size={25}
                                color={theme.primary}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => deleteItem(item.id)}>
                            <FontAwesome
                                style={styles.actionIcons}
                                name="trash"
                                size={25}
                                color="red"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        padding: 10,
    },
    container: {
        flex: 1,
    },
    content: {
        flexDirection: "row",
        gap: 12,
    },
    name: {
        fontWeight: 'bold',
        marginBottom: 4,
        fontSize: 20,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionIcons: {
        marginLeft: 12,
    }
});