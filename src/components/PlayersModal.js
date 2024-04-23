// Create a new file, for example, ModalComponent.js

import React from 'react';
import { Modal, View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import PlayerCard from './PlayerCard';

function PlayersModal({
    modalVisible,
    setModalVisible,
    onChangeText,
    input,
    selectedInput,
    selectedPlayers,
    playerSearched,
    getItemText,
    players,
    handleDeletePlayerBlock,
}) {

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
            }}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalHeader}>Rechercher des joueurs</Text>
                    <TextInput
                        onChangeText={onChangeText}
                        value={input}
                        style={styles.input}
                        placeholder={
                            selectedPlayers[selectedInput]?.length == 3
                                ? "Le maximum est de 3 joueurs, supprimez-en un pour ajouter "
                                : 'Trouver un joueur'
                        }
                        editable={selectedPlayers[selectedInput]?.length == 3 ? false : true}
                    />
                    {input && playerSearched.length > 0 ? (
                        <FlatList
                            data={playerSearched}
                            renderItem={({ item, index }) => getItemText(item, index)}
                            keyExtractor={(item) => `${item.id}`}
                        />
                    ) : null}
                    <Text style={styles.modalHeader}>Les joueurs de bloc </Text>
                    {!selectedPlayers[selectedInput] && <Text>Aucun joueur dans cette bloc </Text>}
                    {selectedPlayers[selectedInput]?.map((playerId, index) => (
                        players.map((player, index) => {
                            if (player.id === playerId) {
                                return <PlayerCard key={index} player={player} handleDeletePlayerBlock={handleDeletePlayerBlock} />;
                            }
                        })
                    ))}
                </View>
            </View>
        </Modal>
    );
};

export default PlayersModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        marginTop: 50
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    input: {
        height: 40,
        marginHorizontal: 10,
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        width: '100%',
    }
});
