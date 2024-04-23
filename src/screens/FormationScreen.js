import { StyleSheet, TextInput, View, Pressable, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Picker } from '@react-native-picker/picker';

import yearsData from '../../assets/data/years.json';
import formationsData from '../../assets/data/formations.json';
import playersData from '../../assets/data/players.json';
import FormationPicker from '../components/FormationPicker';
import Lineup from '../components/Lineup';

export default function FormationScreen() {
    const [selectedFormation, setselectedFormation] = useState()
    const [formations, setFormations] = useState()
    const [playerCount, setplayerCount] = useState()
    const [yearsSelected, setyearsSelected] = useState()
    const [formatName, setformatName] = useState()
    const [selectedPlayers, setSelectedPlayers] = useState({});
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        setFormations(formationsData)
        setPlayers(playersData);
    }, []);

    if (!formations?.length) return null;

    return (
        <View style={styles.container}>
            <TextInput
                placeholder='Nom du format'
                style={styles.input}
                value={formatName}
                onChangeText={text => setformatName(text)}
            />
            <View style={styles.row}>
                <Picker
                    style={styles.picker}
                    selectedValue={yearsSelected}
                    onValueChange={(itemValue) => setyearsSelected(itemValue)}
                >
                    <Picker.Item label="Années" value="" />
                    {yearsData.map((data) => (
                        <Picker.Item key={data.years} label={data.years} value={data.years} />
                    ))}
                </Picker>
                <Picker
                    style={styles.picker}
                    selectedValue={playerCount}
                    onValueChange={(itemValue) => setplayerCount(itemValue)}
                >
                    <Picker.Item label="Nombre de joueurs" value="" />
                    {formations.map((formation) => (
                        <Picker.Item key={formation.nbr} label={formation.nbr} value={formation.nbr} />
                    ))}
                </Picker>
            </View>
            <View style={styles.row}>
                <Picker
                    style={styles.picker}
                    selectedValue={selectedFormation}
                    onValueChange={(itemValue) => setselectedFormation(itemValue)}
                >
                    <Picker.Item label="Shema" value="" />
                    {formations.map((formation) => (
                        formation.nbr === playerCount &&
                        formation?.system_play.map(ftn => (
                            <Picker.Item key={ftn.id} label={ftn.label} value={ftn.label} />
                        ))
                    ))}
                </Picker>
                <Lineup playersData={players} formatName={formatName} yearsSelected={yearsSelected} playerCount={playerCount} formationSelected={selectedFormation} selectedPlayers={selectedPlayers} />
            </View>
            <FormationPicker players={players} setPlayers={setPlayers} formationSelected={selectedFormation} selectedPlayers={selectedPlayers} setSelectedPlayers={setSelectedPlayers} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 50,
    },
    input: {
        height: 40,
        width: '100%',
        marginVertical: 10,
        borderWidth: 1,
        padding: 10,
    },
    picker: {
        flex: 1,
        marginRight: 5,
    },
    singlePicker: {
        width: '100%',
        borderWidth: 1,
        padding: 10,
    }
});