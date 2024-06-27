import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SocialIcon } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" style={styles.backIcon}/>
      </TouchableOpacity>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#aaa"/>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa"/>
      <TextInput style={styles.input} placeholder="Password" secureTextEntry placeholderTextColor="#aaa"/>
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry placeholderTextColor="#aaa"/>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.or}>OR</Text>
      <View style={styles.socialButtons}>
        <SocialIcon type="facebook" />
        <SocialIcon type="twitter" />
        <SocialIcon type="google" />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.signIn}>Already have an account? <Text style={styles.signInLink}>Sign In</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa'
  },
  backIcon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 20
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  button: {
    backgroundColor: '#1e3d58',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 20
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  or: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#aaa'
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  signIn: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#aaa'
  },
  signInLink: {
    color: '#1e3d58',
    fontWeight: '600',
  },
});
