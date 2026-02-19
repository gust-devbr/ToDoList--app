import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import api from '../services/api';
import { useTheme } from '../../context/themeContext';
import NoteModal from '../components/NoteModal';

export default function Notes() {
    const { theme } = useTheme();

    const [notes, setNotes] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [mode, setMode] = useState("create");
    const [selectedNote, setSelectedNote] = useState(null);

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

    async function createNote(title, content) {
        if (!title || !content) return;

        await api.post('/notes', { title, content });
        loadNotes();
    };

    function openCreateModal() {
        setMode("create");
        setSelectedNote(null);
        setModalVisible(true);
    };

    function openEditModal(note) {
        setMode("edit");
        setSelectedNote(note);
        setModalVisible(true);
    };

    async function deleteNote(id) {
        await api.delete(`/notes/${id}`);
        loadNotes();
    };

    async function saveEdit(title, content) {
        if (!title.trim()) return;

        await api.put(`/notes/${selectedNote.id}`, { title, content });
        loadNotes();
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Lista de Notas</Text>
            <Button title='Adicionar Nota' onPress={openCreateModal} />

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

            <NoteModal
                isVisible={modalVisible}
                mode={mode}
                initialTitle={selectedNote?.title}
                initialContent={selectedNote?.content}
                onClose={() => setModalVisible(false)}
                onSubmit={(title, content) => {
                    if (mode === "create") {
                        createNote(title, content);
                    } else {
                        saveEdit(title, content);
                    }
                }}
            />

            {notes.length > 0 && (
                <View style={styles.stats}>
                    <Text style={{ color: theme.text }}>Total: {notes.length}</Text>
                    <Text style={{ color: theme.text }}>Concluídas: {notes.filter(t => t.completed).length}</Text>
                </View>
            )}
        </View>
    )
};

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
    note: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
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