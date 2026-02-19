import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import api from '../services/api';
import { useTheme } from '../../context/themeContext';
import ContactList from '../components/ContactList';
import ContactModal from '../components/ContactModal';

export default function Contacts() {
    const { theme } = useTheme();

    const [contacts, setContacts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [mode, setMode] = useState("create");
    const [selectedContact, setSelectedContact] = useState(null);

    async function loadContacts() {
        try {
            const res = await api.get('/contacts');
            setContacts(res.data);
        } catch (err) {
            console.log("Erro ao buscar contatos", err);
        }
    };

    useEffect(() => {
        loadContacts()
    }, []);

    async function createContact(contact) {
        if (!contact?.name?.trim()
            || !contact?.email?.trim()
            || !contact?.tel?.trim()
            || !contact?.category?.trim()
        ) return;

        await api.post('/contacts', {
            name: contact.name,
            email: contact.email,
            tel: contact.tel,
            category: contact.category
        });

        loadContacts();
    };

    function openCreateModal() {
        setMode("create");
        setSelectedContact(null);
        setModalVisible(true);
    };

    function openEditModal(contact) {
        setMode("edit");
        setSelectedContact(contact);
        setModalVisible(true);
    };

    async function deleteContact(id) {
        await api.delete(`/contacts/${id}`);
        loadContacts();
    };

    async function saveEdit(contact) {
        if (!contact?.name?.trim()
            || !contact?.email?.trim()
            || !contact?.tel?.trim()
            || !contact?.category?.trim()
        ) return;

        await api.put(`/contacts/${contact.id}`, {
            name: contact.name.trim(),
            email: contact.email.trim(),
            tel: contact.tel.trim(),
            category: contact.category.trim()
        });

        loadContacts();
    };
    
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>
                Lista de Contatos
            </Text>
            <Button title='Adicionar Contato' onPress={openCreateModal} />

            <ContactList
                data={contacts}
                open={openEditModal}
                deleteItem={deleteContact}
            />

            <ContactModal
                isVisible={modalVisible}
                mode={mode}
                initialId={selectedContact?.id}
                initialName={selectedContact?.name}
                initialEmail={selectedContact?.email}
                initialTel={selectedContact?.tel}
                initialCategory={selectedContact?.category}
                onClose={() => setModalVisible(false)}
                onSubmit={(contact) => {
                    if (mode === "create") {
                        createContact(contact);
                    } else {
                        saveEdit(contact);
                    }
                }}
            />
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
    // icon: {
    //     marginHorizontal: 5
    // },
    // stats: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between'
    // },
});