import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, Pressable } from 'react-native';
import PlayersModal from './PlayersModal';

export default function FormationPicker({ formationSelected, selectedPlayers = {}, players, setSelectedPlayers }) {
    const [stars, setStars] = useState([]);
    const [selectedInput, setSelectedInput] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [playerSearched, setPlayerSearched] = useState([]);
    const [input, setInput] = useState('');
    const [playerPost, setplayerPost] = useState();

    useEffect(() => {
        formationSelected && generateStars();
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
                !Object?.values(selectedPlayers)?.filter((playersInBlock) => playersInBlock.includes(player.id)).length > 0 &&
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

        const playerSelectedInOtherBlock = Object?.values(selectedPlayers)
            ?.filter((playersInBlock) => playersInBlock.includes(playerId))
            .length > 0;

        const selectedPlayersCount = Object?.values(selectedPlayers)?.reduce(
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
        Object?.keys(updatedSelectedPlayers)?.forEach((key) => {
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
            <PlayersModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                onChangeText={onChangeText}
                input={input}
                selectedInput={selectedInput}
                selectedPlayers={selectedPlayers}
                playerSearched={playerSearched}
                getItemText={getItemText}
                players={players}
                handleDeletePlayerBlock={handleDeletePlayerBlock}
            />
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
