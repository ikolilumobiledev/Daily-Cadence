import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, Animated, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const colors = ['#f28b82', '#fbbc04', '#fff475', '#ccff90', '#a7ffeb', '#cbf0f8', '#aecbfa', '#d7aefb', '#fdcfe8'];

const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

const ReminderItem = ({ id, name, time, status, description, color, onDelete, onEdit }) => {
  const [animatedValue] = useState(new Animated.Value(0));

  const slideOffCard = () => {
    Animated.timing(animatedValue, {
      toValue: -500,
      duration: 500,
      useNativeDriver: true
    }).start(() => {
      onDelete(id);
    });
  };

  const editReminder = () => {
    onEdit(id);
  };

  const bgColorStyle = {
    backgroundColor: color
  };

  const textColorStyle = {
    color: status === 'Done' ? 'green' : 'black'
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -500]
  });

  return (
    <Animated.View style={[styles.reminderItem, bgColorStyle, { transform: [{ translateX }] }]}>
      <Text style={[styles.reminderName, textColorStyle]}>{name}</Text>
      <Text style={styles.reminderDescription}>{description}</Text>
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

const ToDoScreen = ({ navigation }) => {
  const [reminders, setReminders] = useState([]);
  const [newReminderName, setNewReminderName] = useState('');
  const [newReminderDescription, setNewReminderDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const savedReminders = await AsyncStorage.getItem('@reminders');
      if (savedReminders !== null) {
        setReminders(JSON.parse(savedReminders));
      }
    } catch (error) {
      console.error('Error loading reminders:', error.message);
    }
  };

  const saveReminders = async (updatedReminders) => {
    try {
      await AsyncStorage.setItem('@reminders', JSON.stringify(updatedReminders));
    } catch (error) {
      console.error('Error saving reminders:', error.message);
    }
  };

  const addReminder = () => {
    if (!newReminderName || !newReminderDescription) {
      return;
    }

    const currentDate = new Date();
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;

    if (isEditing && editId !== null) {
      const updatedReminders = reminders.map(reminder =>
        reminder.id === editId
          ? { ...reminder, name: newReminderName, description: newReminderDescription }
          : reminder
      );
      setReminders(updatedReminders);
      saveReminders(updatedReminders);
      setIsEditing(false);
      setEditId(null);
    } else {
      const newReminder = {
        id: (reminders.length + 1).toString(),
        name: newReminderName,
        time: time,
        status: 'Done',
        description: newReminderDescription,
        color: getRandomColor()
      };
      const updatedReminders = [...reminders, newReminder];
      setReminders(updatedReminders);
      saveReminders(updatedReminders);
    }

    setNewReminderName('');
    setNewReminderDescription('');
  };

  const deleteReminder = (id) => {
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);
    setReminders(updatedReminders);
    saveReminders(updatedReminders);
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

  useEffect(() => {
    const allCount = reminders.length;
    const todayCount = reminders.filter(reminder => {
      const reminderDate = new Date(reminder.time);
      const today = new Date();
      return reminderDate.toDateString() === today.toDateString();
    }).length;
    const scheduledCount = reminders.filter(reminder => {
      // Implement your logic to filter scheduled reminders
      // For now, count all reminders as scheduled
      return true;
    }).length;

    navigation.setParams({
      allCount,
      todayCount,
      scheduledCount
    });
  }, [reminders]);

  return (
    <KeyboardAvoidingView
      style={styles.mainScreen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={reminders}
        renderItem={({ item }) => (
          <ReminderItem
            {...item}
            onDelete={deleteReminder}
            onEdit={editReminder}
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View style={styles.profile}>
                <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.profileImage} />
                <Text style={styles.userName}>Luiz</Text>
              </View>
              {/* <Text style={styles.calendarDate}>Date Here</Text> */}
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Reminder Name"
                value={newReminderName}
                onChangeText={setNewReminderName}
              />
              <TextInput
                style={styles.input}
                placeholder="Description"
                value={newReminderDescription}
                onChangeText={setNewReminderDescription}
              />
              <TouchableOpacity
                style={[styles.addButton, (!newReminderName || !newReminderDescription) && styles.disabledButton]}
                onPress={addReminder}
                disabled={!newReminderName || !newReminderDescription}
              >
                <Text style={styles.addButtonText}>{isEditing ? '+' : '+'}</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f9ff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    marginTop: 90
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 90
  },
  calendarDate: {
    fontSize: 18,
    color: 'salmon',
    marginTop: 90
  },
  reminderItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },
  reminderName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  reminderDescription: {
    color: '#777',
    marginTop: 5
  },
  reminderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  reminderTime: {
    color: '#777'
  },
  buttonContainer: {
    flexDirection: 'row'
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10
  },
  editButton: {
    backgroundColor: 'salmon'
  },
  doneButton: {
    backgroundColor: 'green'
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    paddingHorizontal: 10,
    marginTop: 60
  },
  addButton: {
    backgroundColor: '#4a90e2',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60
  },
  disabledButton: {
    backgroundColor: '#ccc'
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24
  },
  deleteButtonText: {
    color: "red",
    fontWeight: "bold"
  }
});

export default ToDoScreen;
