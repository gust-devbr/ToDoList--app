import { useState, useEffect } from 'react';

import { View, Text, Button, StyleSheet } from 'react-native';
import { useTheme } from '../../context/themeContext';
import TaskModal from '../components/TaskModal';
import api from '../services/api';
import ItemList from '../components/ItemList';

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

            <ItemList 
                data={tasks}
                open={openEditModal}
                toggle={toggleTasks}
                deleteItem={deleteTasks}
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
    icon: {
        marginHorizontal: 5
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
});