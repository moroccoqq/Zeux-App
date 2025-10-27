import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native'
import { useState } from 'react'

export default function login() {
  const [email, changeEmail] = useState('')
  const [username, changeUsername] = useState('')
  const [password, changePassword] = useState('')

  return (
    <View style={styles.container}>
      <View style={styles.startJourneyContainer}>
        <Text style={styles.startJourney}>Login</Text>
      </View>
      
      <View style={styles.bottom}>
        <TextInput 
          onChangeText={changeEmail}
          value={email}
          placeholder='Email'
          style={styles.input}
          keyboardType='email-address'
        />

        <TextInput 
          onChangeText={changeUsername}
          value={username}
          placeholder='Username'
          style={styles.input}
        />

        <TextInput 
          onChangeText={changePassword}
          value={password}
          placeholder='Password'
          style={styles.input}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151419',
  },
  startJourney: {
    textAlign: "center",
    fontSize: 24,
    color: '#fbfbfb'
  },
  startJourneyContainer: {
    marginTop: 100,
  },
  bottom: {
    backgroundColor: '#f56e0f',
    borderTopLeftRadius: 70,
    borderTopRightRadius: 0,
    overflow: 'hidden',
    padding: 26,
    paddingTop: 40,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '10%',
  },
  input: {
    color: '#fbfbfb',
    padding: 12,
    marginBottom: 10,
    borderColor: "#151419",
  }
})