import { Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'

export default function Lineup(props) {

    const generateLineup = (data) => {
        const {
            formatName,
            yearsSelected,
            playerCount,
            selectedPlayers,
            playersData
        } = data


        const lineup = {
            id: 217,
            nom: formatName,
            plan: {
                blocks: []
            },
            schema: "541",
            playercount: playerCount,
            nbrplayer: 5,
            years: JSON.stringify(yearsSelected),
            zoom: 75,
            created_id: "231",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null,
            bg: "bg.svg",
            authorities: 0,
            trash_id: null
        };

        for (const [key, playerIds] of Object.entries(selectedPlayers)) {
            const [blockIndex, positionIndex] = key.split("-").map(Number);
            const players = playerIds.map((playerId) => {
                const playerInfo = playersData?.map(player => player.id == playerId);
                // console.log(playersData)
                return {
                    club_id: playerInfo.club_id,
                    club: playerInfo.club,
                    club_logo: playerInfo.club_logo,
                    user_id: playerInfo.user_id,
                    nom: playerInfo.nom,
                    num: playerInfo.num,
                    post: playerInfo.post,
                    pied: playerInfo.pied,
                    id: playerId,
                    date_naiss: playerInfo.date_naiss,
                    prenom: playerInfo.prenom,
                    img: playerInfo.img
                };
            });
            // console.log(players)

            if (!lineup.plan.blocks[blockIndex]) {
                lineup.plan.blocks[blockIndex] = { block: blockIndex + 1, positions: [] };
                // console.log(lineup.plan.blocks[blockIndex] = { block: blockIndex + 1, positions: [] })
            }
            lineup.plan.blocks[blockIndex].positions[positionIndex] = {
                poste: `poste-${blockIndex}-${positionIndex}`,
                players
            };
        }

        return lineup;
    };

    const handleSave = () => {
        console.log(generateLineup(props))
    };
    return (
        <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.text}>Save</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    saveButton: {
        width: '30%',
        padding: 5,
        backgroundColor: '#4169e1',
        borderRadius: 10,
        justifyContent: "center"
    },
    text: {
        textAlign: "center",
        fontSize: 16,
        color: "white",
        fontWeight: "700"
    }
})