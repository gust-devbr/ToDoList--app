import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import api from '../services/api';
import { useTheme } from '../../context/themeContext';

export default function Tasks() {
    const { theme } = useTheme();

    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');

    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editId, setEditId] = useState(null);

    async function loadTasks() {
        try {
            const res = await api.get('/tasks');
            setTasks(Array.isArray(res.data) ? res.data : res.data.tasks || []);
        } catch (err) {
            console.error('Erro ao carregar tarefas', err);
            setTasks([]);
        }
    }

    useEffect(() => {
        loadTasks();
    }, []);

    async function createTasks() {
        if (!title.trim()) return;
        await api.post('/tasks', { title });
        setTitle('');
        setIsModalCreateOpen(false);
        loadTasks();
    }

    async function toggleTasks(id) {
        await api.patch(`/tasks/${id}`);
        loadTasks();
    }

    async function deleteTasks(id) {
        await api.delete(`/tasks/${id}`);
        loadTasks();
    }

    function openEditModal(task) {
        setEditId(task.id);
        setEditTitle(task.title);
        setIsModalEditOpen(true);
    }

    async function saveEdit() {
        if (!editTitle.trim()) return;
        await api.put(`/tasks/${editId}`, { title: editTitle });
        setIsModalEditOpen(false);
        loadTasks();
    }

    return (    
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Lista de Tarefas</Text>
            <Button title="Adicionar Tarefa" onPress={() => setIsModalCreateOpen(true)} />

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

            <Modal visible={isModalCreateOpen} animationType="slide" transparent={true}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <TextInput
                            placeholder="Digite a tarefa"
                            value={title}
                            onChangeText={setTitle}
                            style={styles.input}
                        />
                        <Button title="Criar" onPress={createTasks} />
                        <Button title="Fechar" onPress={() => setIsModalCreateOpen(false)} color="red" />
                    </View>
                </View>
            </Modal>

            <Modal visible={isModalEditOpen} animationType="slide" transparent={true}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <TextInput
                            value={editTitle}
                            onChangeText={setEditTitle}
                            style={styles.input}
                        />
                        <Button title="Salvar" onPress={saveEdit} />
                        <Button title="Fechar" onPress={() => setIsModalEditOpen(false)} color="red" />
                    </View>
                </View>
            </Modal>

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
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'

    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10

    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        padding: 10,
        borderRadius: 5

    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    actionIcons: {
        marginLeft: 10,
    }
});
