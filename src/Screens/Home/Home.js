// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';

// const remindersData = [
//   { id: '1', name: 'Buy groceries', time: '06:00', status: 'Done', description: 'Buy milk and bread' },
//   { id: '2', name: 'Meeting with John', time: '08:30', status: 'Done', description: 'Discuss project updates' },
//   { id: '3', name: 'Workout', time: '13:00', status: 'Not yet', description: 'Go to the gym for an hour' }
// ];

// const ReminderItem = ({ id, name, time, status, description, onDelete }) => (
//   <View style={styles.reminderItem}>
//     <View style={styles.reminderDetails}>
//       <Text style={styles.reminderName}>{name}</Text>
//       <Text style={styles.reminderTime}>{time}</Text>
//     </View>
//     <Text style={styles.reminderDescription}>{description}</Text>
//     <Text style={[styles.reminderStatus, { color: status === 'Done' ? 'green' : 'red' }]}>{status}</Text>
//     <TouchableOpacity onPress={() => onDelete(id)} style={styles.deleteButton}>
//       <Text style={styles.deleteButtonText}>Delete</Text>
//     </TouchableOpacity>
//   </View>
// );

// const HomeScreen = () => {
//   const [reminders, setReminders] = useState(remindersData);
//   const [newReminderName, setNewReminderName] = useState('');
//   const [newReminderDescription, setNewReminderDescription] = useState('');

//   const addReminder = () => {
//     const currentDate = new Date();
//     const hours = currentDate.getHours().toString().padStart(2, '0');
//     const minutes = currentDate.getMinutes().toString().padStart(2, '0');
//     const time = `${hours}:${minutes}`;
//     const newReminder = {
//       id: (reminders.length + 1).toString(),
//       name: newReminderName,
//       time: time,
//       status: 'Not yet',
//       description: newReminderDescription
//     };
//     setReminders([...reminders, newReminder]);
//     setNewReminderName('');
//     setNewReminderDescription('');
//   };

//   const deleteReminder = (id) => {
//     const updatedReminders = reminders.filter(reminder => reminder.id !== id);
//     setReminders(updatedReminders);
//   };

//   const currentDate = new Date();
//   const formattedDate = currentDate.toLocaleDateString('en-GB', {
//     weekday: 'long',
//     day: 'numeric',
//     month: 'long',
//     year: 'numeric'
//   });

//   return (
//     <KeyboardAvoidingView
//       style={styles.mainScreen}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//     >
//       <FlatList
//         data={reminders}
//         renderItem={({ item }) => <ReminderItem {...item} onDelete={deleteReminder} />}
//         keyExtractor={(item) => item.id}
//         ListHeaderComponent={
//           <>
//             <View style={styles.header}>
//               <View style={styles.profile}>
//                 <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.profileImage} />
//                 <Text style={styles.userName}>Luiz</Text>
//               </View>
//               <Text style={styles.calendarDate}>{formattedDate}</Text>
//             </View>
//             <View style={styles.inputContainer}>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Reminder Name"
//                 value={newReminderName}
//                 onChangeText={setNewReminderName}
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Description"
//                 value={newReminderDescription}
//                 onChangeText={setNewReminderDescription}
//               />
//               <TouchableOpacity style={styles.addButton} onPress={addReminder}>
//                 <Text style={styles.addButtonText}>+</Text>
//               </TouchableOpacity>
//             </View>
//           </>
//         }
//         contentContainerStyle={{ paddingBottom: 20 }}
//       />
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   mainScreen: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f0f9ff'
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center'
//   },
//   profile: {
//     flexDirection: 'row',
//     alignItems: 'center'
//   },
//   profileImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//     marginBottom: 90
//   },
//   userName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 90
//   },
//   calendarDate: {
//     fontSize: 18,
//     color: '#4a90e2'
//   },
//   reminderItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 15,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     marginBottom: 10
//   },
//   reminderDetails: {
//     flexDirection: 'column'
//   },
//   reminderName: {
//     fontSize: 16,
//     fontWeight: 'bold'
//   },
//   reminderTime: {
//     color: '#777'
//   },
//   reminderDescription: {
//     color: '#777'
//   },
//   reminderStatus: {
//     fontWeight: 'bold'
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20
//   },
//   input: {
//     flex: 1,
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     marginRight: 10,
//     paddingHorizontal: 10
//   },
//   addButton: {
//     backgroundColor: '#4a90e2',
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   addButtonText: {
//     color: '#fff',
//     fontSize: 24
//   },
//   deleteButtonText: {
//     color: "red",
//     fontWeight: "bold"
//   }
// });

// export default HomeScreen;



  
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'black',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Moves time to the left and profile to the right
    alignItems: 'center',
    marginBottom: 20,
  },
  time: {
    color: 'white',
    fontSize: 20,
  },
  profileContainer: {
    alignItems: 'center',
  },
  profileIcon: {
    width: 90, // Increase the size of the profile image
    height: 90,
    borderRadius: 35, 
    marginLeft:190,
    marginTop:20
  },
  userEmail: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
    marginLeft:190
  },
  icons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#333',
    width: '30%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardNumber: {
    color: 'white',
    fontSize: 20,
    marginTop: 10,
  },
  cardNumber1: {
    color: 'white',
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
  },
  cardText: {
    color: 'white',
    marginTop: 5,
  },
  cardText1: {
    color: 'green',
    marginTop: 5,
    fontWeight: 'bold',
  },
  myLists: {
    color: 'white',
    marginLeft: 10,
    marginBottom: 10,
  },
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  listCard: {
    backgroundColor: '#333',
    width: '30%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  calendarCard: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
});

export default HomeScreen;
