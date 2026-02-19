import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { useTheme } from "../../context/themeContext";

export default function ItemList({ data, open, toggle, deleteItem }) {
    const { theme } = useTheme();

    const safeData = Array.isArray(data) ? data : [];

    const isNote = safeData.length > 0 && "content" in safeData[0];
    const isTask = safeData.length > 0 && "completed" in safeData[0];

    return (
        <FlatList
            style={{ marginTop: 20 }}
            data={safeData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.item}>
                    <Text style={{ textDecorationLine: item.completed ? 'line-through' : 'none', flex: 1, color: theme.text, fontSize: 18 }}>
                        {item.title}
                    </Text>
                    {isNote && (
                        <Text style={{ flex: 1, color: theme.text, fontSize: 18 }}>
                            {item.content}
                        </Text>
                    )}
                    <TouchableOpacity onPress={() => open(item)}>
                        <FontAwesome style={styles.actionIcons} name="pencil" size={22} color={theme.primary} />
                    </TouchableOpacity>
                    {isTask && (
                        <TouchableOpacity onPress={() => toggle(item.id)}>
                            {item.completed
                                ? <Fontisto style={styles.actionIcons} name="arrow-return-left" size={23} color={"blue"} />
                                : <FontAwesome style={styles.actionIcons} name="check" size={23} color={'blue'} />}
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => deleteItem(item.id)}>
                        <FontAwesome style={styles.actionIcons} name="trash" size={22} color={'red'} />
                    </TouchableOpacity>
                </View>
            )}
        />
    )
};

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    actionIcons: {
        marginLeft: 10,
    }
})