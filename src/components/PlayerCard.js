import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { Pressable } from 'react-native';

export default function PlayerCard({ player, index, handleDeletePlayerBlock }) {
  return (
    <View key={index} style={styles.itemContainer}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: player.img }}
          style={styles.avatar}
        />
      </View>
      <View style={styles.details}>
        <Text style={styles.name}>{player.nom} {player.prenom}</Text>
        <View style={styles.teamContainer}>
          <Text style={styles.team}>{player.club}</Text>
          <Text style={styles.position}>({player.post})</Text>
        </View>
      </View>
      <Pressable
        style={styles.avatarContainer}
        onPress={() => handleDeletePlayerBlock(player.id)}>
        <Text style={styles.position}>Delete</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({

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

  itemContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: 'center'
  },
});
