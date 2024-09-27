import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, ActivityIndicator, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import app from '../../Authentication/Firebase/Config';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth(app);
  const rotation = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(false); // To control loading spinner

  const handleLogIn = async () => {
    setIsLoading(true); // Show spinner when login starts

    // Spinning animation
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();

    // Introduce a delay before starting authentication
    setTimeout(() => {
      signInWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
          const user = userCredentials.user;
          console.log('Logged In with:', user.email);
          navigation.navigate('Main');
          setIsLoading(false); // Stop spinner after login
        })
        .catch(error => {
          alert('Log In First');
          setIsLoading(false); // Stop spinner on error
        });
    }, 2000); // 2 seconds delay

    try {
      await AsyncStorage.setItem('MyEmail', email);
    } catch (error) {
      console.log(error);
    }
  };

  const load = async () => {
    try {
      let storedEmail = await AsyncStorage.getItem('MyEmail');
      if (storedEmail !== null) {
        setEmail(storedEmail);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Interpolating rotation value to a degree for the button
  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <ImageBackground
      source={require('../../../assets/log.jpg')} // Background image
      style={styles.background} // Style for the background
    >
      <View style={styles.container}>
        <Text style={styles.subtitle}>Login</Text>
        <TextInput
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholderTextColor='#a4a6a5'
          autoCorrect={false}
          autoComplete='off'
          keyboardType='email-address'
          style={styles.forminput}
          placeholder='Email Address'
        />
        <TextInput
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholderTextColor='#a4a6a5'
          secureTextEntry={true}
          autoCorrect={false}
          autoCapitalize='none'
          style={styles.forminput}
          placeholder='Password'
        />
        {/* <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.button} onPress={handleLogIn} disabled={isLoading}>
          {isLoading ? (
            <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
              <ActivityIndicator size="small" color="#fff" />
            </Animated.View>
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.or}>OR</Text>
        <View style={styles.socialButtons}>
          {/* Social Buttons can go here */}
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUp}>
            Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center', // Center the content
    alignItems: 'center', // Center the content
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(248, 249, 250, 0.8)' // Slightly transparent background for better readability
  },
  subtitle: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 20,
    marginHorizontal: 120,
    color: '#1e3d58', // Change color for better contrast
  },
  forminput: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
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
    marginVertical: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  or: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#aaa',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  signUp: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#aaa',
    fontSize: 16,
  },
  signUpLink: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
