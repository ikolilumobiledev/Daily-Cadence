//  import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, Animated, Image } from 'react-native';
// import { getFirestore, collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
// import app from '../../Authentication/Firebase/Config'; // Make sure to configure Firebase properly
// import DateTimePicker from '@react-native-community/datetimepicker'; // Install this package if not already installed

// const colors = ['#f28b82', '#fbbc04', '#fff475', '#ccff90', '#a7ffeb', '#cbf0f8', '#aecbfa', '#d7aefb', '#fdcfe8'];
// const db = getFirestore(app);

// const getRandomColor = () => {
//   return colors[Math.floor(Math.random() * colors.length)];
// };

// const generateUniqueId = () => {
//   return `${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`;
// };

// // ReminderItem Component
// const ReminderItem = ({ id, name, time, status, description, color, onDelete, onEdit }) => {
//   const [animatedValue] = useState(new Animated.Value(0));

//   const slideOffCard = () => {
//     Animated.timing(animatedValue, {
//       toValue: -500,
//       duration: 500,
//       useNativeDriver: true
//     }).start(() => {
//       onDelete(id);
//     });
//   };

//   const editReminder = () => {
//     onEdit(id);
//   };

//   const bgColorStyle = {
//     backgroundColor: color
//   };

//   const textColorStyle = {
//     color: status === 'Done' ? 'green' : 'black'
//   };

//   const translateX = animatedValue.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -500]
//   });

//   return (
//     <Animated.View style={[styles.reminderItem, bgColorStyle, { transform: [{ translateX }] }]}>
//       <Text style={[styles.reminderName, textColorStyle]}>{name}</Text>
//       <Text style={styles.reminderDescription}>{description}</Text>
//       <View style={styles.reminderDetails}>
//         <Text style={styles.reminderTime}>{time}</Text>
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity onPress={editReminder} style={[styles.actionButton, styles.editButton]}>
//             <Text style={styles.actionButtonText}>Edit</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={slideOffCard} style={[styles.actionButton, styles.doneButton]}>
//             <Text style={styles.actionButtonText}>Done</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Animated.View>
//   );
// };

//     const ToDoScreen = ({ route, navigation }) => {
//   const { cardName, userEmail, userId, username } = route.params;
//   const [reminders, setReminders] = useState([]);
//   const [newReminderName, setNewReminderName] = useState('');
//   const [newReminderDescription, setNewReminderDescription] = useState('');
//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [reminderTime, setReminderTime] = useState(new Date()); // New state for the time input
//   const [showTimePicker, setShowTimePicker] = useState(false); // Show/hide time picker


//   useEffect(() => {
//     fetchRemindersFromFirestore();
//   }, []);

//   const fetchRemindersFromFirestore = async () => {
//     try {
//       const q = query(
//         collection(db, 'Reminders'),
//         where('userId', '==', userId),
//         where('cardName', '==', cardName)
//       );
//       const querySnapshot = await getDocs(q);
//       const fetchedReminders = querySnapshot.docs.map((doc) => ({
//         ...doc.data(),
//         id: doc.id,
//       }));
//       setReminders(fetchedReminders);
//     } catch (error) {
//       console.error('Error fetching reminders from Firestore:', error.message);
//     }
//   };

//   const addReminderToFirestore = async (reminder) => {
//     try {
//       const reminderRef = doc(db, 'Reminders', reminder.id);
//       await setDoc(reminderRef, reminder);
//       console.log('Reminder added to Firestore:', reminder);
//     } catch (error) {
//       console.error('Error saving reminder to Firestore:', error.message);
//     }
//   };

//   const addReminder = () => {
//     if (!newReminderName || !newReminderDescription) {
//       return;
//     }

//     const currentDate = new Date();
//     const hours = currentDate.getHours().toString().padStart(2, '0');
//     const minutes = currentDate.getMinutes().toString().padStart(2, '0');
//     const time = `${hours}:${minutes}`;

//     if (isEditing && editId !== null) {
//       const updatedReminders = reminders.map(reminder =>
//         reminder.id === editId
//           ? { ...reminder, name: newReminderName, description: newReminderDescription }
//           : reminder
//       );
//       setReminders(updatedReminders);
//       setIsEditing(false);
//       setEditId(null);
//     } else {
//       const newReminder = {
//         id: generateUniqueId(),
//         name: newReminderName,
//         time: reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Using the chosen time
//         status: 'Done',
//         description: newReminderDescription,
//         color: getRandomColor(),
//         userId: userId,
//         email: userEmail,
//         cardName: cardName,
//       };

//       const updatedReminders = [...reminders, newReminder];
//     setReminders(updatedReminders);
//     addReminderToFirestore(newReminder);

//     setNewReminderName('');
//     setNewReminderDescription('');
//     setReminderTime(new Date()); // Resetting the time picker
//   };

//     setNewReminderName('');
//     setNewReminderDescription('');
//   };

//   const deleteReminder = (id) => {
//     const updatedReminders = reminders.filter(reminder => reminder.id !== id);
//     setReminders(updatedReminders);
//   };

//   const editReminder = (id) => {
//     const reminderToEdit = reminders.find(reminder => reminder.id === id);
//     if (reminderToEdit) {
//       setNewReminderName(reminderToEdit.name);
//       setNewReminderDescription(reminderToEdit.description);
//       setIsEditing(true);
//       setEditId(id);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.mainScreen}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//     >
//       <View style={styles.headerContainer}>
//         <Text style={styles.cardName}>{cardName}</Text>
//         <View style={styles.profileContainer}>
//           <Image source={require('../../../assets/boy.png')} style={styles.profileImage} />
//           <Text style={styles.userEmail}>{username}</Text>
//         </View>
//       </View>

//       <FlatList
//         data={reminders}
//         renderItem={({ item }) => (
//           <ReminderItem
//             {...item}
//             onDelete={deleteReminder}
//             onEdit={editReminder}
//           />
//         )}
//         keyExtractor={(item) => item.id}
//         ListHeaderComponent={
//           <>
//             <View style={styles.inputContainer}>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Reminder Name"
//                 value={newReminderName}
//                 onChangeText={setNewReminderName}
//                 placeholderTextColor={'white'}
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Description"
//                 value={newReminderDescription}
//                 onChangeText={setNewReminderDescription}
//                 placeholderTextColor={'white'}

//               />
//                <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.timePickerButton}>
//                 <Text style={styles.timePickerText}>Select Time: {reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
//               </TouchableOpacity>

//               {showTimePicker && (
//                 <DateTimePicker
//                   value={reminderTime}
//                   mode="time"
//                   is24Hour={true}
//                   display="default"
//                   onChange={(event, selectedTime) => {
//                     setShowTimePicker(false);
//                     if (selectedTime) {
//                       setReminderTime(selectedTime);
//                     }
//                   }}
//                 />
//               )}
//               <TouchableOpacity
//                 style={[styles.addButton, (!newReminderName || !newReminderDescription) && styles.disabledButton]}
//                 onPress={addReminder}
//                 disabled={!newReminderName || !newReminderDescription}
//               >
//                 <Text style={styles.addButtonText}>{isEditing ? 'Update' : '+'}</Text>
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
//     backgroundColor: '#'
//   },
//   // header: {
//   //   flexDirection: 'row',
//   //   justifyContent: 'space-between',
//   //   alignItems: 'center'
//   // },
//   // profile: {
//   //   flexDirection: 'row',
//   //   alignItems: 'center'
//   // },

//   // profileImage: {
//   //   width: 40,
//   //   height: 40,
//   //   borderRadius: 20,
//   //   marginRight: 10,
//   //   marginTop: 90
//   // },
//   // userName: {
//   //   fontSize: 18,
//   //   fontWeight: 'bold',
//   //   marginTop: 90
//   // },
//   calendarDate: {
//     fontSize: 18,
//     color: 'salmon',
//     marginTop: 90
//   },
//   reminderItem: {
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10
//   },
//   reminderName: {
//     fontSize: 16,
//     fontWeight: 'bold'
//   },
//   reminderDescription: {
//     color: '#777',
//     marginTop: 5,
//     fontSize:20
    
//   },
//   reminderDetails: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10
//   },
//   reminderTime: {
//     color: '#777'
//   },
//   buttonContainer: {
//     flexDirection: 'row'
//   },
//   actionButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//     marginRight: 10
//   },
//   editButton: {
//     backgroundColor: 'salmon'
//   },
//   doneButton: {
//     backgroundColor: 'green'
//   },
//   actionButtonText: {
//     color: '#fff',
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
//     paddingHorizontal: 10,
//     marginTop: 60
//   },
//   addButton: {
//     backgroundColor: '#4a90e2',
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 60
//   },
//   disabledButton: {
//     backgroundColor: '#ccc'
//   },
//   addButtonText: {
//     color: '#fff',
//     fontSize: 24
//   },
//   deleteButtonText: {
//     color: "red",
//     fontWeight: "bold"
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 10,
//   },
//   cardName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'black', // You can change this color as needed
//   },
//   profileContainer: {
//     alignItems: 'center', // Center items vertically
//   },
//   profileImage: {
//     width: 90,
//     height: 90,
//     borderRadius: 10,
//     marginTop:40
//   },
//   userEmail: {
//     fontSize: 16,
//     color: 'black', // You can change this color as needed
//     textAlign: 'center', // Center the email text
//     marginTop: 4, // Space between the image and email
//   },
// });

// export default ToDoScreen;
// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, Animated, Image } from 'react-native';
// import { getFirestore, collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
// import app from '../../Authentication/Firebase/Config'; // Make sure to configure Firebase properly
// import DateTimePicker from '@react-native-community/datetimepicker'; // Install this package if not already installed

// const colors = ['#f28b82', '#fbbc04', '#fff475', '#ccff90', '#a7ffeb', '#cbf0f8', '#aecbfa', '#d7aefb', '#fdcfe8'];
// const db = getFirestore(app);

// const getRandomColor = () => {
//   return colors[Math.floor(Math.random() * colors.length)];
// };

// const generateUniqueId = () => {
//   return `${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`;
// };

// // ReminderItem Component
// const ReminderItem = ({ id, name, time, status, description, color, onDelete, onEdit }) => {
//   const [animatedValue] = useState(new Animated.Value(0));

//   const slideOffCard = () => {
//     Animated.timing(animatedValue, {
//       toValue: -500,
//       duration: 500,
//       useNativeDriver: true
//     }).start(() => {
//       onDelete(id);
//     });
//   };

//   const editReminder = () => {
//     onEdit(id);
//   };

//   const bgColorStyle = {
//     backgroundColor: color
//   };

//   const textColorStyle = {
//     color: status === 'Done' ? 'green' : 'black'
//   };

//   const translateX = animatedValue.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -500]
//   });

//   return (
//     <Animated.View style={[styles.reminderItem, bgColorStyle, { transform: [{ translateX }] }]}>
//       <Text style={[styles.reminderName, textColorStyle]}>{name}</Text>
//       <Text style={styles.reminderDescription}>{description}</Text>
//       <View style={styles.reminderDetails}>
//         <Text style={styles.reminderTime}>{time}</Text>
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity onPress={editReminder} style={[styles.actionButton, styles.editButton]}>
//             <Text style={styles.actionButtonText}>Edit</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={slideOffCard} style={[styles.actionButton, styles.doneButton]}>
//             <Text style={styles.actionButtonText}>Done</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Animated.View>
//   );
// };

// const ToDoScreen = ({ route, navigation }) => {
//   const { cardName, userEmail, userId, username } = route.params;
//   const [reminders, setReminders] = useState([]);
//   const [newReminderName, setNewReminderName] = useState('');
//   const [newReminderDescription, setNewReminderDescription] = useState('');
//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [reminderTime, setReminderTime] = useState(new Date());
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [spinAnim] = useState(new Animated.Value(0)); // Spin animation value




//   useEffect(() => {
//     fetchRemindersFromFirestore();
//   }, []);

//   const fetchRemindersFromFirestore = async () => {
//     try {
//       const q = query(
//         collection(db, 'Reminders'),
//         where('userId', '==', userId),
//         where('cardName', '==', cardName)
//       );
//       const querySnapshot = await getDocs(q);
//       const fetchedReminders = querySnapshot.docs.map((doc) => ({
//         ...doc.data(),
//         id: doc.id,
//       }));
//       setReminders(fetchedReminders);
//     } catch (error) {
//       console.error('Error fetching reminders from Firestore:', error.message);
//     }
//   };

//   const addReminderToFirestore = async (reminder) => {
//     try {
//       const reminderRef = doc(db, 'Reminders', reminder.id);
//       await setDoc(reminderRef, reminder);
//       console.log('Reminder added to Firestore:', reminder);
//     } catch (error) {
//       console.error('Error saving reminder to Firestore:', error.message);
//     }
//   };

//   const addReminder = () => {
//     if (!newReminderName || !newReminderDescription) return;

//     // Start the spinning animation
//     Animated.timing(spinAnim, {
//       toValue: 1,
//       duration: 1000, // Spin for 1 second
//       useNativeDriver: true,
//     }).start(() => {
//       const newReminder = {
//         id: generateUniqueId(),
//         name: newReminderName,
//         time: reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         status: 'Pending',
//         description: newReminderDescription,
//         color: getRandomColor(),
//         userId: userId,
//         email: userEmail,
//         cardName: cardName,
//       };

//       const updatedReminders = [...reminders, newReminder];
//       setReminders(updatedReminders);
//       addReminderToFirestore(newReminder);

//       // Reset inputs and show success message
//       setNewReminderName('');
//       setNewReminderDescription('');
//       setReminderTime(new Date());
//       alert('Reminder has been created successfully');

//       // Reset spin animation
//       spinAnim.setValue(0);
//     });
//   };

//   const deleteReminder = (id) => {
//     const updatedReminders = reminders.filter(reminder => reminder.id !== id);
//     setReminders(updatedReminders);
//   };

//   const editReminder = (id) => {
//     const reminderToEdit = reminders.find(reminder => reminder.id === id);
//     if (reminderToEdit) {
//       setNewReminderName(reminderToEdit.name);
//       setNewReminderDescription(reminderToEdit.description);
//       setIsEditing(true);
//       setEditId(id);
//     }
//   };
//   const spin = spinAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg'],
//   });

//   return (
//     <KeyboardAvoidingView
//       style={styles.mainScreen}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//     >
//       <View style={styles.headerContainer}>
//         <Text style={styles.cardName}>{cardName}</Text>
//         <View style={styles.profileContainer}>
//           <Image source={require('../../../assets/boy.png')} style={styles.profileImage} />
//           <Text style={styles.userEmail}>{username}</Text>
//         </View>
//       </View>

//       <FlatList
//         data={reminders}
//         renderItem={({ item }) => (
//           <ReminderItem
//             {...item}
//             onDelete={deleteReminder}
//             onEdit={editReminder}
//           />
//         )}
//         keyExtractor={(item) => item.id}
//         ListHeaderComponent={
//           <View style={styles.inputContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder="Reminder Name"
//               value={newReminderName}
//               onChangeText={setNewReminderName}
//               placeholderTextColor={'white'}
//               multiline={true}
//               scrollEnabled={false} // Prevent scrolling inside input
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Description"
//               value={newReminderDescription}
//               onChangeText={setNewReminderDescription}
//               placeholderTextColor={'white'}
//               multiline={true}
//               scrollEnabled={false} // Prevent scrolling inside input
//             />

//             <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.timePickerButton}>
//               <Text style={styles.timePickerText}>Select Time: {reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
//             </TouchableOpacity>

//             {showTimePicker && (
//               <DateTimePicker
//                 value={reminderTime}
//                 mode="time"
//                 is24Hour={true}
//                 display="default"
//                 onChange={(event, selectedTime) => {
//                   setShowTimePicker(false);
//                   if (selectedTime) {
//                     setReminderTime(selectedTime);
//                   }
//                 }}
//               />
//             )}

//             {/* Spinning + button */}
//             <Animated.View style={{ transform: [{ rotate: spin }] }}>
//               <TouchableOpacity
//                 style={[styles.addButton, (!newReminderName || !newReminderDescription) && styles.disabledButton]}
//                 onPress={addReminder}
//                 disabled={!newReminderName || !newReminderDescription}
//               >
//                 <Text style={styles.addButtonText}>{isEditing ? 'Update' : '+'}</Text>
//               </TouchableOpacity>
//             </Animated.View>
//           </View>
//         }
//         contentContainerStyle={{ paddingBottom: 20 }}
//       />
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   mainScreen: {
//     flex: 1,
//     backgroundColor: '#121212',
//     paddingHorizontal: 20,
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 10,
//   },
//   cardName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   profileContainer: {
//     alignItems: 'center',
//   },
//   profileImage: {
//     width: 90,
//     height: 90,
//     borderRadius: 10,
//     marginTop: 50,
//   },
//   userEmail: {
//     fontSize: 16,
//     color: 'white',
//     textAlign: 'center',
//     marginTop: 4,
//   },
//   inputContainer: {
//     flexDirection: 'column',
//     marginBottom: 20,
//     marginTop: 20,
//   },

//    input: {
//     backgroundColor: '#333333',
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 10,
//     color: '#ffffff',
//     textAlignVertical: 'top', // Text breaks to the next line
//     minHeight: 60, // Prevents scrolling by setting a minimum height
//     multiline: true,
//     scrollEnabled: false, // Disables text input scrolling
//   },
//   timePickerButton: {
//     backgroundColor: '#444444',
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 10,
//   },
//   timePickerText: {
//     color: '#ffffff', // Time picker button text color
//     textAlign: 'center',
//   },
//   addButton: {
//     backgroundColor: 'red',
//     borderRadius: 50, // Round button
//     width: 60, // Adjust size for round shape
//     height: 60,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
 
//   addButtonText: {
//     color: '#ffffff',
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   disabledButton: {
//     backgroundColor: '#1e90ff',
//   },
//   reminderItem: {
//     backgroundColor: '#555555',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   reminderName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   reminderDescription: {
//     fontSize: 14,
//     marginVertical: 5,
//     flexWrap: 'wrap', // Breaks text to the next line when long
//   },
//   reminderDetails: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   reminderTime: {
//     fontSize: 14,
//     fontStyle: 'italic',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//   },
//   actionButton: {
//     padding: 5,
//     marginLeft: 10,
//     borderRadius: 8,
//   },
//   editButton: {
//     backgroundColor: '#f0ad4e',
//   },
//   doneButton: {
//     backgroundColor: '#5cb85c',
//   },
//   actionButtonText: {
//     color: '#ffffff',
//     fontSize: 14,
//   },
// });



// export default ToDoScreen;
     









import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, Animated, Image } from 'react-native';
import { getFirestore, collection, query, where, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import app from '../../Authentication/Firebase/Config'; // Make sure to configure Firebase properly
import DateTimePicker from '@react-native-community/datetimepicker'; // Install this package if not already installed

const colors = ['#f28b82', '#fbbc04', '#fff475', '#ccff90', '#a7ffeb', '#cbf0f8', '#aecbfa', '#d7aefb', '#fdcfe8'];
const db = getFirestore(app);

const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

const generateUniqueId = () => {
  return `${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`;
};

// ReminderItem Component
const ReminderItem = ({ id, name, time, status, description, color, creationDate, onDelete, onEdit }) => {
  const [animatedValue] = useState(new Animated.Value(0));

  const slideOffCard = () => {
    Animated.timing(animatedValue, {
      toValue: -500,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      onDelete(id);
    });
  };

  const editReminder = () => {
    onEdit(id);
  };

  const bgColorStyle = {
    backgroundColor: color,
  };

  const textColorStyle = {
    color: status === 'Done' ? 'green' : 'black',
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -500],
  });

  return (
    <Animated.View style={[styles.reminderItem, bgColorStyle, { transform: [{ translateX }] }]}>
      <Text style={[styles.reminderName, textColorStyle]}>{name}</Text>
      <Text style={styles.reminderDescription}>{description}</Text>
      <Text style={styles.reminderDate}>Created on: {creationDate}</Text> 
      <View style={styles.reminderDetails}>
        <Text style={styles.reminderTime}>{time}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={editReminder} style={[styles.actionButton, styles.editButton]}>
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={slideOffCard} style={[styles.actionButton, styles.doneButton]}>
            <Text style={styles.actionButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const ToDoScreen = ({ route, navigation }) => {
  const { cardName, userEmail, userId, username } = route.params;
  const [reminders, setReminders] = useState([]);
  const [newReminderName, setNewReminderName] = useState('');
  const [newReminderDescription, setNewReminderDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [spinAnim] = useState(new Animated.Value(0)); // Spin animation value

  useEffect(() => {
    fetchRemindersFromFirestore();
  }, []);

  const fetchRemindersFromFirestore = async () => {
    try {
      let q;
      if (cardName === 'All') {
        // Fetch all reminders (without filtering by cardName)
        q = query(collection(db, 'Reminders'), where('userId', '==', userId));
      } else if (cardName === 'Today') {
        // Filter reminders set up on the current day
        const today = new Date();
        const todayFormatted = today.toLocaleDateString(); // Format the date to match creationDate
        q = query(
          collection(db, 'Reminders'),
          where('userId', '==', userId),
          where('creationDate', '==', todayFormatted)
        );
      } else {
        // Fetch reminders for a specific card name
        q = query(
          collection(db, 'Reminders'),
          where('userId', '==', userId),
          where('cardName', '==', cardName)
        );
      }
  
      const querySnapshot = await getDocs(q);
      const fetchedReminders = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setReminders(fetchedReminders);
    } catch (error) {
      console.error('Error fetching reminders from Firestore:', error.message);
    }
  };
  
  

  const addReminderToFirestore = async (reminder) => {
    try {
      const reminderRef = doc(db, 'Reminders', reminder.id);
      await setDoc(reminderRef, reminder);
      console.log('Reminder added to Firestore:', reminder);
    } catch (error) {
      console.error('Error saving reminder to Firestore:', error.message);
    }
  };

  const addReminder = async () => {
    if (!newReminderName || !newReminderDescription) return;
    const creationDate = new Date().toLocaleDateString(); // Add creation date

    // Start the spinning animation
    Animated.timing(spinAnim, {
      toValue: 1,
      duration: 5000, // Spin for 1 second
      useNativeDriver: true,
    }).start(async () => {
      const reminderData = {
        name: newReminderName,
        time: reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Pending',
        description: newReminderDescription,
        color: getRandomColor(),
        userId: userId,
        email: userEmail,
        cardName: cardName,
        creationDate:creationDate
      };
  
      if (isEditing) {
        // Update the existing reminder in Firestore
        try {
          const reminderRef = doc(db, 'Reminders', editId);
          await updateDoc(reminderRef, reminderData);
          const updatedReminders = reminders.map((reminder) =>
            reminder.id === editId ? { ...reminder, ...reminderData } : reminder
          );
          setReminders(updatedReminders);
          alert('Reminder updated successfully');
        } catch (error) {
          console.error('Error updating reminder:', error.message);
        }
        setIsEditing(false);
        setEditId(null);
      } else {
        // Add a new reminder
        const newReminder = {
          ...reminderData,
          id: generateUniqueId(),
        };
  
        const updatedReminders = [...reminders, newReminder];
        setReminders(updatedReminders);
        await addReminderToFirestore(newReminder);
        alert('Reminder has been created successfully');
      }
  
      // Reset inputs and spin animation
      setNewReminderName('');
      setNewReminderDescription('');
      setReminderTime(new Date());
      spinAnim.setValue(0);
    });
  };
  

  const deleteReminder = async (id) => {
    try {
      const reminderRef = doc(db, 'Reminders', id);
  
      // Update the status to 'Completed'
      await updateDoc(reminderRef, { status: 'Completed' });
  
      // Remove the reminder from the local list (but do not delete from Firestore)
      const updatedReminders = reminders.filter(reminder => reminder.id !== id);
      setReminders(updatedReminders);
  
      console.log(`Reminder with ID ${id} marked as completed.`);
    } catch (error) {
      console.error('Error updating reminder status:', error.message);
    }
  };
  

  const editReminder = (id) => {
    const reminderToEdit = reminders.find(reminder => reminder.id === id);
    if (reminderToEdit) {
      setNewReminderName(reminderToEdit.name);
      setNewReminderDescription(reminderToEdit.description);
      setIsEditing(true);
      setEditId(id);
    }
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <KeyboardAvoidingView
      style={styles.mainScreen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.cardName}>{cardName}</Text>
        <View style={styles.profileContainer}>
          <Image source={require('../../../assets/boy.png')} style={styles.profileImage} />
          <Text style={styles.userEmail}>{username}</Text>
        </View>
      </View>

      <FlatList
  data={reminders.filter(reminder => reminder.status !== 'Completed')} // Filter out "Completed" reminders
  renderItem={({ item }) => (
    <ReminderItem
      {...item}
      onDelete={deleteReminder}
      onEdit={editReminder}
    />
  )}
  keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Reminder Name"
              value={newReminderName}
              onChangeText={setNewReminderName}
              placeholderTextColor={'white'}
              multiline={true}
              scrollEnabled={false} // Prevent scrolling inside input
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newReminderDescription}
              onChangeText={setNewReminderDescription}
              placeholderTextColor={'white'}
              multiline={true}
              scrollEnabled={false} // Prevent scrolling inside input
            />

            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.timePickerButton}>
              <Text style={styles.timePickerText}>Select Time: {reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>

            {showTimePicker && (
        <DateTimePicker
          value={reminderTime}
          mode="time"
          is24Hour={true}
          display="spinner" // or "default"
          textColor="white" // Only works on iOS
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) {
              setReminderTime(selectedTime);
                  }
                }}
              />
            )}

            {/* Spinning + button */}
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <TouchableOpacity
                style={[styles.addButton, (!newReminderName || !newReminderDescription) && styles.disabledButton]}
                onPress={addReminder}
                disabled={!newReminderName || !newReminderDescription}
              >
                <Text style={styles.addButtonText}>{isEditing ? 'Update' : '+'}</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  cardName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginTop: 50,
  },
  userEmail: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'column',
    marginBottom: 20,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#333333',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: '#ffffff',
    textAlignVertical: 'top', // Text breaks to the next line
    minHeight: 60, // Prevents scrolling by setting a minimum height
    multiline: true,
    scrollEnabled: false, // Disables text input scrolling
  },
  timePickerButton: {
    backgroundColor: '#444444',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  timePickerText: {
    color: '#ffffff', // Time picker button text color
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: 'red',
    borderRadius: 50, // Round button
    width: 60, // Adjust size for round shape
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#1e90ff',
  },
  reminderItem: {
    backgroundColor: '#555555',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  reminderName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reminderDescription: {
    fontSize: 19,
    marginVertical: 5,
    flexWrap: 'wrap', // Breaks text to the next line when long
  },
  reminderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderTime: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 5,
    marginLeft: 10,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: '#f0ad4e',
  },
  doneButton: {
    backgroundColor: '#5cb85c',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  reminderDate: {
    fontSize: 17, // Adjust size as needed
    color: '#888', // Light grey color
    marginTop: 5, // Add some spacing at the top
    fontStyle: 'italic', // Optional: make the date italic to differentiate it
  },
});

export default ToDoScreen;