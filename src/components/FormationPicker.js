import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, Pressable, Modal, FlatList } from 'react-native';
import { TextInput } from 'react-native';
import playersData from '../../assets/data/players.json';
import PlayerCard from './PlayerCard';

export default function FormationPicker({ formationSelected }) {
    const [stars, setStars] = useState([]);
    const [selectedInput, setSelectedInput] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [playerSearched, setPlayerSearched] = useState([]);
    const [players, setPlayers] = useState([]);
    const [input, setInput] = useState('');
    const [playerPost, setplayerPost] = useState();
    const [selectedPlayers, setSelectedPlayers] = useState({});

    useEffect(() => {
        formationSelected && generateStars();
        setPlayers(playersData);
        setSelectedPlayers({})
    }, [formationSelected]);

    const generateStars = () => {
        const formatSplited = formationSelected?.split('-');
        const starsArray = [];

        formatSplited.forEach(segment => {
            const num = parseInt(segment);
            starsArray.push('+'.repeat(num));
        });

        setStars(starsArray.reverse());
    };


    const handlePress = (rowIndex, charIndex) => {

        let positions;
        if (stars.length == 5) {
            positions = ["C", "M", "M", "D", "GK"];
        } else if (stars.length == 4) {
            positions = ["C", "M", "D", "GK"];
        } else {
            positions = ["C", "D", "GK"];
        }

        let position = rowIndex < positions.length ? positions[rowIndex] : "";

        const key = `${rowIndex}-${charIndex}`;
        //console.log(position)
        setplayerPost(position)
        setSelectedInput(key);
        setModalVisible(true);
        setInput();
    };

    const onChangeText = (text) => {
        setInput(text);
        if (text.length > 1) {
            const filteredPlayers = players.filter((player) =>
                (player.nom.toUpperCase().includes(text.toUpperCase()) ||
                    player.prenom.toUpperCase().includes(text.toUpperCase())) &&
                !Object.values(selectedPlayers)?.filter((playersInBlock) => playersInBlock.includes(player.id)).length > 0 &&
                player.post.toUpperCase() == playerPost.toUpperCase()
            );
            setPlayerSearched(filteredPlayers)
        } else {
            setPlayerSearched([]);
        }
    };

    const getItemText = (item, index) => {
        return (
            <Pressable
                onPress={() => BlockPlayersSelect(item.id)}
                style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
            >
                <View style={styles.itemContainer} key={index}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: item.img }}
                            style={styles.avatar}
                        />
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.name}>{item.nom} {item.prenom}</Text>
                        <View style={styles.teamContainer}>
                            <Text style={styles.team}>{item.club}</Text>
                            <Text style={styles.position}>({item.post})</Text>
                        </View>
                    </View>
                </View>
            </Pressable>
        );
    };

    const BlockPlayersSelect = (playerId) => {
        setModalVisible(false);
        const selectedPlayersForInput = selectedPlayers[selectedInput] || [];

        const playerSelectedInOtherBlock = Object.values(selectedPlayers)
            .filter((playersInBlock) => playersInBlock.includes(playerId))
            .length > 0;

        const selectedPlayersCount = Object.values(selectedPlayers).reduce(
            (total, playersInBlock) => total + playersInBlock.length,
            0
        );

        const reachedMaxLimit = selectedPlayersCount >= stars.length * 3;
        if (!playerSelectedInOtherBlock && selectedPlayersForInput.length < 3 && !reachedMaxLimit) {
            setSelectedPlayers({
                ...selectedPlayers,
                [selectedInput]: [...selectedPlayersForInput, playerId],
            });
        }
    };

    const handleDeletePlayerBlock = (playerId) => {
        const updatedSelectedPlayers = { ...selectedPlayers };
        Object.keys(updatedSelectedPlayers).forEach((key) => {
            const updatedPlayersInBlock = updatedSelectedPlayers[key].filter((id) => id !== playerId);
            updatedSelectedPlayers[key] = updatedPlayersInBlock;
        });

        setSelectedPlayers(updatedSelectedPlayers);
    };


    return (
        <View style={styles.container}>
            <Image
                style={styles.imageStyle}
                source={require('../../assets/images/STDFTB.jpg')}
            />
            <View style={styles.overlay}>
                {stars.map((line, rowIndex) => (
                    <View key={rowIndex} style={styles.line}>
                        {line.split('').map((char, charIndex) => (
                            <Pressable
                                key={charIndex}
                                style={styles.button}
                                onPress={() => handlePress(rowIndex, charIndex)}>
                                <Text style={styles.stars}>{char}</Text>
                                <View style={styles.playerBlockContainer}>
                                    {selectedPlayers[`${rowIndex}-${charIndex}`]?.map((playerId, index) => (
                                        <View key={index} style={styles.playerBlock}>
                                            <Image
                                                source={{ uri: players.find(player => player.id === playerId).img }}
                                                style={styles.avatarSmall}
                                            />
                                        </View>
                                    ))}
                                </View>
                            </Pressable>
                        ))}
                    </View>
                ))}
            </View>
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
                            placeholder={selectedPlayers[selectedInput]?.length == 3 ? "le maximum est de 3 joueurs, supprimez-en un pour ajouter " : 'trouver un joueur'}
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
                        {
                            selectedPlayers[selectedInput]?.map((playerId, index) => (
                                players.map((player, index) => {
                                    if (player.id === playerId) {
                                        return <PlayerCard index={index} player={player} handleDeletePlayerBlock={handleDeletePlayerBlock} />
                                    }
                                })
                            ))
                        }
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageStyle: {
        width: 320,
        height: 450,
        top: 0,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        backgroundColor: 'transparent',
        justifyContent: 'space-around',
        top: 25,
    },
    line: {
        flexDirection: 'row',
    },
    button: {
        padding: 5,
    },
    stars: {
        color: 'red',
        fontSize: 38,
        padding: 20,
    },
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
    avatarContainer: {
        marginRight: 10,
        display: 'flex',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    details: {
        flex: 1,
    },
    name: {
        fontWeight: '700',
        fontSize: 16,
        marginBottom: 5,
    },
    teamContainer: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    team: {
        fontSize: 12,
        marginRight: 5,
    },
    position: {
        fontSize: 12,
        color: "red"
    },
    input: {
        height: 40,
        marginHorizontal: 10,
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        width: '100%',
    },
    itemContainer: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: 'center'
    },
    playerBlockContainer: {
        flexDirection: 'row',
    },
    playerBlock: {
        top: -80,
        borderRadius: 5,
        display: "flex"
    },
    avatarSmall: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
});
