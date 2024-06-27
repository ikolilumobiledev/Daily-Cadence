import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SocialIcon } from 'react-native-elements';

export default function SignInScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Login</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa"/>
      <TextInput style={styles.input} placeholder="Password" secureTextEntry placeholderTextColor="#aaa"/>
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Main')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.or}>OR</Text>
      <View style={styles.socialButtons}>
        <SocialIcon type="facebook" />
        <SocialIcon type="twitter" />
        <SocialIcon type="google" />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUp}>Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text></Text>
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
  title: {
    fontSize: 24,
    fontWeight: '300',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 20,
    marginHorizontal:120
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
  forgotPassword: {
    textAlign: 'right',
    color: '#1e3d58',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#1e3d58',
    padding: 15,
    alignItems: 'center',
    borderRadius: 30,
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
  signUp: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#aaa'
  },
  signUpLink: {
    color: '#1e3d58',
    fontWeight: '600',
  },
});
