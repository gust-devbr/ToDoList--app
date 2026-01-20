import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import api from '../services/api';
import { useTheme } from '../../context/themeContext';

export default function Notes() {
    const { theme } = useTheme();

    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editId, setEditId] = useState(null);

    async function loadNotes() {
        try {
            const res = await api.get('/notes');
            setNotes(Array.isArray(res.data) ? res.data : res.data.notes || []);
        } catch (err) {
            console.error("Erro ao carregar notas", err);
            setNotes([]);
        }
    };

    useEffect(() => {
        loadNotes();
    }, []);

    async function createNote() {
        if (!title || !content) return;
        await api.post('/notes', { title, content });
        setTitle('');
        setContent('');
        setIsModalCreateOpen(false);
        loadNotes();
    };

    async function deleteNote(id) {
        await api.delete(`/notes/${id}`);
        loadNotes();
    };

    function openEditModal(note) {
        setEditId(note.id);
        setEditTitle(note.title);
        setEditContent(note.content);
        setIsModalEditOpen(true);
    };

    async function saveEdit() {
        if (!editTitle.trim() || !editContent.trim()) return;
        await api.put(`/notes/${editId}`, { title: editTitle, content: editContent });
        setIsModalEditOpen(false);
        loadNotes();
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Lista de Notas</Text>
            <Button title='Adicionar Nota' onPress={() => setIsModalCreateOpen(true)} />

            <FlatList
                style={{ marginTop: 20 }}
                data={notes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.note}>
                        <Text style={{ fontSize: 18, flex: 1, color: theme.text }}> 
                            {item.title}   ---   {item.content}
                        </Text>
                        <TouchableOpacity onPress={() => openEditModal(item)}>
                            <FontAwesome style={styles.actionIcons} name="pencil" size={22} color={theme.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteNote(item.id)}>
                            <FontAwesome style={styles.actionIcons} name="trash" size={22} color={'red'} />
                        </TouchableOpacity>
                    </View>
                )}
            />

            <Modal visible={isModalCreateOpen} animationType="slide" transparent={true}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <TextInput
                            placeholder="Digite o título:"
                            value={title}
                            onChangeText={setTitle}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Digite o conteúdo:"
                            value={content}
                            onChangeText={setContent}
                            style={styles.input}
                        />
                        <Button title='Criar' onPress={createNote} />
                        <Button title='Cancelar' onPress={() => setIsModalCreateOpen(false)} color="red" />
                    </View>
                </View>
            </Modal>

            <Modal visible={isModalEditOpen} animationType="slide" transparent={true}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <TextInput
                            placeholder='Editar título:'
                            value={editTitle}
                            onChangeText={setEditTitle}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder='Editar conteúdo:'
                            value={editContent}
                            onChangeText={setEditContent}
                            style={styles.input}
                        />
                        <Button title='Salvar' onPress={saveEdit} />
                        <Button title='Cancelar' onPress={() => setIsModalEditOpen(false)} color="red" />
                    </View>
                </View>
            </Modal>

            {notes.length > 0 && (
                <View style={styles.stats}>
                    <Text>Total: {notes.length}</Text>
                    <Text>Concluídas: {notes.filter(t => t.completed).length}</Text>
                </View>
            )}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 70
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10
    },
    note: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
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