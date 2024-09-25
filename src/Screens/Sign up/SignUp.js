import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import app from '../../Authentication/Firebase/Config';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore"; 

const SignUpScreen = ({ navigation }) => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [password, setPassword] = useState('');

    const generateUniqueId = () => {
        return 'id-' + new Date().getTime() + '-' + Math.floor(Math.random() * 1000);
    };

    // const handleLawyerSubmit = async () => {
    //     const newLawyer = {
    //         username,
    //         email,
    //         phonenumber,
    //         password,
    //         id: generateUniqueId()
    //     };

    //     console.log(newLawyer);

    //     try {
    //         await setDoc(doc(db, "Lawyer", newLawyer.id), newLawyer);
    //         await createUserWithEmailAndPassword(auth, email, password);
    //         console.log('Successfully registered as a lawyer:', email);
    //         navigation.navigate('Payment');
    //     } catch (error) {
    //         console.error('Error during registration:', error.message);
    //         alert('Registration failed: ' + error.message);
    //     }
    // };

    const handleCustomerSubmit = async () => {
        const newCustomer = {
            username,
            email,
            phonenumber,
            password,
            id: generateUniqueId()
        };

        console.log(newCustomer);

        try {
            await setDoc(doc(db, "Customer", newCustomer.id), newCustomer);
            await createUserWithEmailAndPassword(auth, email, password);
            console.log('Successfully registered as a customer:', email);
            navigation.navigate('Main');
        } catch (error) {
            console.error('Error during registration:', error.message);
            alert('Registration failed: ' + error.message);
        }
    };

    return (
        <SafeAreaView style={styles.log}>
            <View style={styles.welcome}>
                <View style={styles.welcometext}>
                    <TouchableOpacity onPress={() => { navigation.navigate('Home') }}>
                    </TouchableOpacity>
                    <Text style={styles.welcomeback}>JOIN OUR COMMUNITY</Text>
                </View>
            </View>

            <ScrollView style={styles.form}>
                <View style={styles.fill}>
                    <Text style={styles.filltext}>Fill in the forms below to continue</Text>
                </View>

                <View style={styles.formcontainer}>
                    <TextInput
                        value={username}
                        onChangeText={(text) => setUsername(text)}
                        placeholderTextColor='#a4a6a5'
                        autoCorrect={false} autoComplete='off'
                        keyboardType='name-phone-pad'
                        style={styles.forminput} placeholder='User Name' />
                </View>

                <View style={styles.formcontainer}>
                    <TextInput
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        placeholderTextColor='#a4a6a5'
                        autoCorrect={false} autoComplete='off'
                        keyboardType='email-address'
                        style={styles.forminput} placeholder='Email Address' />
                </View>

                <View style={styles.formcontainer}>
                    <TextInput
                        value={phonenumber}
                        onChangeText={(text) => setPhonenumber(text)}
                        placeholderTextColor='#a4a6a5'
                        autoCorrect={false} autoComplete='off'
                        keyboardType='number-pad'
                        style={styles.forminput} placeholder='Phone Number' />
                </View>

                <View style={styles.formcontainer}>
                    <TextInput
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        placeholderTextColor='#a4a6a5'
                        secureTextEntry={true}
                        autoCorrect={false} autoCapitalize='none'
                        style={styles.forminput} placeholder='Password' />
                </View>

                <View style={styles.register}>
                    {/* <TouchableOpacity style={styles.registerbtn} onPress={() => handleLawyerSubmit()}>
                        <Text style={styles.registertext}>Submit as Lawyer</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity style={styles.registerbtn} onPress={() => handleCustomerSubmit()}>
                        <Text style={styles.registertext}>Sign UP</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    log: {
        flex: 1,
        backgroundColor: '#243035'
    },
    welcometext: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        paddingHorizontal: 10,
    },
    welcomeback: {
        color: 'white',
        fontSize: 28,
        marginLeft: 30,
        fontFamily: 'Courier New'
    },
    fill: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginVertical: 1,
        padding: 10,
        alignItems: 'center'
    },
    filltext: {
        color: 'white',
        paddingHorizontal: 10,
        fontFamily: 'Euphemia UCAS'
    },
    form: {
        flex: 1,
        paddingTop: 10
    },
    formcontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 30,
        marginVertical: 20
    },
    formicon: {
        paddingHorizontal: 5
    },
    forminput: {
        fontSize: 15,
        padding: 13,
        width: 300,
        backgroundColor: '#323E43',
        color: 'white',
        marginLeft: 5,
        fontFamily: 'Euphemia UCAS'
    },
    register: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    registerbtn: {
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        alignItems: 'center',
        marginVertical: 10
    },
    registertext: {
        color: 'white',
        fontSize: 30,
        fontWeight: '400',
        marginVertical: 1,
        fontFamily: 'Euphemia UCAS'
    },
});

export default SignUpScreen;
