import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
    return (
        <ImageBackground
            source={require('../../../assets/cadence.jpg')}
            style={styles.background}
        >
            <View style={styles.overlay}>
                <View style={styles.logoContainer}>
                    {/* <Text style={styles.logoText}>Daily Cadence</Text> */}
                </View>
                <View style={styles.textContainer}>
                    {/* <Text style={styles.welcomeText}>Welcome to Daily Cadence</Text> */}
                    {/* <Text style={styles.tagline}>Revolutionizing Daily Activities</Text> */}
                </View>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignIn')}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2024 Daily Cadence</Text>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    logoContainer: {
        marginBottom: 20,
    },
    logoText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    tagline: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        marginTop:30
    },
    button: {
        backgroundColor: '#6200EE',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 25,
        marginTop:300
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 20,
    },
    footerText: {
        fontSize: 14,
        color: 'white',
    },
});

export default WelcomeScreen;
