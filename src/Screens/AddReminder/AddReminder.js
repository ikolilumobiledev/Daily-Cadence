import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MedicationsContext } from '../Context/MedicationsContext';
import { useNavigation } from '@react-navigation/native';

const AddReminderModal = () => {
  const [medicationName, setMedicationName] = useState('');
  const [medicationQuantity, setMedicationQuantity] = useState('');
  const { addMedication } = useContext(MedicationsContext);
  const navigation = useNavigation();

  const addReminder = () => {
    const newMedication = {
      id: Date.now().toString(),
      name: medicationName,
      time: 'N/A', // Assuming time is not set here
      status: 'Not yet', // Default status
      quantity: medicationQuantity,
    };
    addMedication(newMedication);
    navigation.goBack(); // Close the modal after adding the reminder
  };

  return (
    <View style={styles.modalContainer}>
      <Text style={styles.title}>Add Reminder</Text>
      <TextInput
        style={styles.input}
        placeholder="Medication Name"
        value={medicationName}
        onChangeText={setMedicationName}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={medicationQuantity}
        onChangeText={setMedicationQuantity}
      />
      <TouchableOpacity style={styles.addButton} onPress={addReminder}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelButtonText: {
    color: 'red',
    fontSize: 16,
  },
});

export default AddReminderModal;
