import { View, Modal, Button, StyleSheet, TextInput } from 'react-native';
import { useState, useEffect } from 'react';

export default function ContactModal({
    isVisible,
    mode,
    initialId,
    initialName = '',
    initialEmail = '',
    initialTel = '',
    initialCategory = '',
    onClose,
    onSubmit
}) {

    const [currentContact, setCurrentContact] = useState({
        id: null,
        name: "",
        email: "",
        tel: "",
        category: ""
    });

    useEffect(() => {
        if (isVisible) {
            setCurrentContact({
                id: initialId ?? null,
                name: initialName ?? "",
                email: initialEmail ?? "",
                tel: initialTel ?? "",
                category: initialCategory ?? ""
            });
        }
    }, [isVisible, initialId, initialName, initialEmail, initialTel, initialCategory]);

    const isCreate = mode === 'create';

    function handleSubmit() {
        onSubmit(currentContact);
        onClose();
    };

    function handleChange(field, value) {
        setCurrentContact(prev => ({
            ...prev,
            [field]: value
        }));
    }

    return (
        <Modal visible={isVisible} animationType="slide" transparent>
            <View style={styles.modalBackground}>
                <View style={styles.modalContent}>

                    <TextInput
                        placeholder={isCreate ? "Nome" : "Editar Nome"}
                        value={currentContact.name}
                        onChangeText={(text) => handleChange('name', text)}
                        style={styles.input}
                    />

                    <TextInput
                        placeholder={isCreate ? "Email" : "Editar Email"}
                        value={currentContact.email}
                        onChangeText={(text) => handleChange('email', text)}
                        style={styles.input}
                    />

                    <TextInput
                        placeholder={isCreate ? "Telefone" : "Editar Telefone"}
                        value={currentContact.tel}
                        onChangeText={(text) => handleChange('tel', text)}
                        style={styles.input}
                    />

                    <TextInput
                        placeholder={isCreate ? "Categoria" : "Editar Categoria"}
                        value={currentContact.category}
                        onChangeText={(text) => handleChange('category', text)}
                        style={styles.input}
                    />

                    <Button
                        title={isCreate ? "Criar" : "Salvar"}
                        onPress={handleSubmit}
                    />

                    <Button
                        title="Fechar"
                        onPress={onClose}
                        color="red"
                    />

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
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
});