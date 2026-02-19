import { View, Modal, Button, StyleSheet, TextInput } from 'react-native';
import { useState, useEffect } from 'react';

export default function TaskModal({
    isVisible,
    mode,
    initialTitle = '',
    onClose,
    onSubmit
}) {
    const [title, setTitle] = useState("");

    useEffect(() => {
        if (isVisible) {
            setTitle(initialTitle)
        }
    }, [isVisible, initialTitle]);

    const isCreate = mode === 'create';

    function handleSubmit() {
        onSubmit(title);
        onClose();
    };
    return (
        <Modal visible={isVisible} animationType="slide" transparent={true}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                    <TextInput
                        placeholder={isCreate ? "Digite o título" : "Editar Título"}
                        value={title}
                        onChangeText={setTitle}
                        style={styles.input}
                    />
                    <Button title={isCreate ? "Criar" : "Salvar"} onPress={handleSubmit} />
                    <Button title="Fechar" onPress={onClose} color="red" />
                </View>
            </View>
        </Modal>
    )
};

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