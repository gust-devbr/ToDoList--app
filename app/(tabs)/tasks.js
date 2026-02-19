import { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { useTheme } from '../../context/themeContext';
import TaskModal from '../components/TaskModal';
import api from '../services/api';

export default function Tasks() {
    const { theme } = useTheme();

    const [tasks, setTasks] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [mode, setMode] = useState("create");
    const [selectedTask, setSelectedTask] = useState(null);

    async function loadTasks() {
        try {
            const res = await api.get('/tasks');
            setTasks(Array.isArray(res.data) ? res.data : res.data.tasks || []);
        } catch (err) {
            console.error('Erro ao carregar tarefas', err);
            setTasks([]);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    async function createTask(title) {
        if (!title.trim()) return;

        await api.post("/tasks", { title });
        loadTasks();
    };

    function openCreateModal() {
        setMode("create");
        setSelectedTask(null);
        setModalVisible(true);
    };

    function openEditModal(task) {
        setMode("edit");
        setSelectedTask(task);
        setModalVisible(true);
    };

    async function toggleTasks(id) {
        await api.patch(`/tasks/${id}`);
        loadTasks();
    };

    async function deleteTasks(id) {
        await api.delete(`/tasks/${id}`);
        loadTasks();
    };

    async function saveEdit(title) {
        if (!title.trim()) return;

        await api.put(`/tasks/${selectedTask.id}`, { title });
        loadTasks();
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Lista de Tarefas</Text>
            <Button title="Adicionar Tarefa" onPress={openCreateModal} />

            <FlatList
                style={{ marginTop: 20 }}
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.task}>
                        <Text style={{ textDecorationLine: item.completed ? 'line-through' : 'none', flex: 1, color: theme.text, fontSize: 18 }}>
                            {item.title}
                        </Text>
                        <TouchableOpacity onPress={() => openEditModal(item)}>
                            <FontAwesome style={styles.actionIcons} name="pencil" size={22} color={theme.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => toggleTasks(item.id)}>
                            {item.completed ?
                                <Fontisto style={styles.actionIcons} name="arrow-return-left" size={23} color={"blue"} /> : <FontAwesome style={styles.actionIcons} name="check" size={23} color={'blue'} />}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteTasks(item.id)}>
                            <FontAwesome style={styles.actionIcons} name="trash" size={22} color={'red'} />
                        </TouchableOpacity>
                    </View>
                )}
            />

            <TaskModal
                isVisible={modalVisible}
                mode={mode}
                initialTitle={selectedTask?.title}
                onClose={() => setModalVisible(false)}
                onSubmit={(title) => {
                    if (mode === "create") {
                        createTask(title);
                    } else {
                        saveEdit(title);
                    }
                }}
            />

            {tasks.length > 0 && (
                <View style={styles.stats}>
                    <Text style={{ color: theme.text }}>Total: {tasks.length}</Text>
                    <Text style={{ color: theme.text }}>Concluídas: {tasks.filter(t => t.completed).length}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 50
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10
    },
    task: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    icon: {
        marginHorizontal: 5
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    actionIcons: {
        marginLeft: 10,
    }
});
