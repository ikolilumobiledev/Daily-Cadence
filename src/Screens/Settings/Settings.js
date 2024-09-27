import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button, ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

const SettingsScreen = () => {
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [reminders, setReminders] = useState([]);
  const [groupedReminders, setGroupedReminders] = useState({});

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
    const db = getFirestore();
    const userDocRef = doc(db, 'Customer', userId); // Reference to the user document

    // Update the username and phone number in Firestore
    await updateDoc(userDocRef, {
      username: username,
      phonenumber: phoneNumber,
    });

    alert('Profile updated successfully!');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile section at the top right corner */}
      <View style={styles.header}>
        <Image source={require('../../../assets/boy.png')} style={styles.profileIcon} />
        <Text style={styles.username}>{username}</Text>
      </View>

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

        <Button title="Update Profile" onPress={handleUpdateProfile} color="#4CAF50" />
      </View>

      {/* Grouped Reminders Section */}
      <View style={styles.remindersContainer}>
        <Text style={styles.title}>Your Reminders</Text>
        {Object.keys(groupedReminders).map((cardName, index) => (
          <View key={index} style={styles.reminderGroup}>
            <Text style={styles.cardName}>{cardName} ({groupedReminders[cardName].length})</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  profileIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
    marginTop: 5,
    backgroundColor: '#f9f9f9',
  },
  remindersContainer: {
    marginTop: 20,
  },
  reminderGroup: {
    marginBottom: 20,
  },
  cardName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#4A90E2', // Color for card name
  },
  reminderCard: {
    backgroundColor: '#ffffff',
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
  },
  reminderStatus: {
    fontSize: 16,
    color: '#555',
  },
  reminderDescription: {
    fontSize: 16,
    color: '#333',
  },
  reminderTime: {
    fontSize: 14,
    color: '#888',
  },
});

export default SettingsScreen;
