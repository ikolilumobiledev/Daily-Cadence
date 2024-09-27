import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ActivityIndicator, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [reminders, setReminders] = useState([]);
  const [groupedReminders, setGroupedReminders] = useState({});
  const [loading, setLoading] = useState(false); // For profile update spinner
  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    const db = getFirestore();

    if (user) {
      setUserEmail(user.email);

      const fetchCustomerData = async () => {
        try {
          const q = query(collection(db, 'Customer'), where('email', '==', user.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const customerData = doc.data();
              console.log('Full Customer Data:', customerData);
              setUsername(customerData.username);
              setUserId(customerData.id);
              setPhoneNumber(customerData.phonenumber);
              fetchReminders(customerData.id); // Fetch reminders after getting the user ID
            });
          } else {
            console.log('No matching customer documents found.');
          }
        } catch (error) {
          console.error('Error fetching customer data:', error);
        }
      };

      fetchCustomerData();
    }
  }, []);

  const fetchReminders = async (userId) => {
    const db = getFirestore();
    const remindersQuery = query(collection(db, 'Reminders'), where('userId', '==', userId));
    const querySnapshot = await getDocs(remindersQuery);

    const remindersArray = [];
    querySnapshot.forEach((doc) => {
      const reminder = doc.data();
      console.log('Reminder Document:', reminder);
      remindersArray.push(reminder);
    });

    setReminders(remindersArray);
    groupReminders(remindersArray); // Call to group reminders
  };

  const groupReminders = (remindersArray) => {
    const grouped = remindersArray.reduce((acc, reminder) => {
      const cardName = reminder.cardName || "Other"; // Default to "Other" if cardName is not defined
      if (!acc[cardName]) {
        acc[cardName] = [];
      }
      acc[cardName].push(reminder);
      return acc;
    }, {});

    setGroupedReminders(grouped);
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    const db = getFirestore();
    const userDocRef = doc(db, 'Customer', userId);

    try {
      // Update the username and phone number in Firestore
      await updateDoc(userDocRef, {
        username: username,
        phonenumber: phoneNumber,
      });

      setLoading(false);
      alert('Profile updated successfully!');
    } catch (error) {
      setLoading(false);
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut().then(() => {
      navigation.navigate('SignIn'); // Navigate to login screen after logout
    }).catch((error) => {
      console.error('Error logging out:', error);
    });
  };

  return (
    <ImageBackground source={require('../../../assets/back (2).jpg')} style={styles.background}>
      {/* Fixed Profile Section */}
      <View style={styles.header}>
        <Image source={require('../../../assets/boy.png')} style={styles.profileIcon} />
        <Text style={styles.username}>{username}</Text>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Image source={require('../../../assets/power (1).png')} style={styles.logoutIcon} />
          <Text style={{marginHorizontal:14, color:"red", fontSize:15}}>LOGOUT</Text>

        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* User information display */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>Profile Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Username:</Text>
            <TextInput 
              style={styles.input} 
              value={username} 
              onChangeText={setUsername} 
            />
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{userEmail}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone Number:</Text>
            <TextInput 
              style={styles.input} 
              value={phoneNumber} 
              onChangeText={setPhoneNumber} 
            />
          </View>

          {/* Update Profile Button */}
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.updateButtonText}>Update Profile</Text>}
          </TouchableOpacity>
        </View>

        {/* Grouped Reminders Section */}
        <View style={styles.remindersContainer}>
          <Text style={styles.title}>Your Reminders</Text>
          {Object.keys(groupedReminders).map((cardName, index) => (
            <View key={index} style={styles.reminderGroup}>
              <View style={styles.cardContainer}>
                <Text style={styles.cardName}>{cardName} ({groupedReminders[cardName].length})</Text>
              </View>
              {groupedReminders[cardName].map((reminder, idx) => (
                <View key={idx} style={styles.reminderCard}>
                  <Text style={styles.reminderName}>{reminder.name}</Text>
                  <Text style={styles.reminderStatus}>Status: {reminder.status}</Text>
                  <Text style={styles.reminderDescription}>{reminder.description}</Text>
                  <Text style={styles.reminderTime}>{reminder.time}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Adjust background image to cover the entire screen
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffffcc', // Slight transparency
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    position: 'absolute', // Make header fixed
    top: 0,
    width: '100%',
    zIndex: 10,
  },
  profileIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  logoutIcon: {
    width: 70,
    height: 70,
  },
  scrollContainer: {
    paddingTop: 150, // Offset for fixed header
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  infoRow: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
  },
  value: {
    fontSize: 18,
    fontWeight: '400',
    color: '#333',
    paddingVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
    marginTop: 5,
    backgroundColor: '#f2f2f2',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  remindersContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  reminderGroup: {
    marginBottom: 20,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'salmon', // Color for card name
  },
  reminderCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reminderName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  reminderStatus: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  reminderDescription: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  reminderTime: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
});

export default SettingsScreen;
