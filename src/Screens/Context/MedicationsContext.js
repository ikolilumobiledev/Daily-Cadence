import React, { createContext, useState } from 'react';

export const MedicationsContext = createContext();

export const MedicationsProvider = ({ children }) => {
  const [medications, setMedications] = useState([
    { id: '1', name: 'Vitamin C', time: '06:00', status: 'Done', quantity: '1 capsule' },
    { id: '2', name: 'Collagen', time: '08:30', status: 'Done', quantity: '2 capsules' },
    { id: '3', name: 'Vitamin B1', time: '13:00', status: 'Not yet', quantity: '1 capsule' }
  ]);

  const addMedication = (medication) => {
    setMedications([...medications, medication]);
  };

  return (
    <MedicationsContext.Provider value={{ medications, setMedications, addMedication }}>
      {children}
    </MedicationsContext.Provider>
  );
};
