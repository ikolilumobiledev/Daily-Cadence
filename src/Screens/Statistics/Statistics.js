import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { Dimensions } from 'react-native';

const StatisticsScreen = () => {
  const [reminderData, setReminderData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    const db = getFirestore();

    if (user) {
      const fetchUserData = async () => {
        try {
          const q = query(collection(db, 'Customer'), where('email', '==', user.email));
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            if (!querySnapshot.empty) {
              querySnapshot.forEach((doc) => {
                const customerData = doc.data();
                fetchReminders(customerData.id); // Fetch reminders based on the user ID in real-time
              });
            } else {
              console.log('No matching customer documents found.');
              setLoading(false);
            }
          });

          return () => unsubscribe();
        } catch (error) {
          console.error('Error fetching customer data:', error);
          setLoading(false);
        }
      };

      fetchUserData();
    } else {
      console.log('No user logged in');
      setLoading(false);
    }
  }, []);

  const fetchReminders = (userId) => {
    const db = getFirestore();
    const remindersQuery = query(collection(db, 'Reminders'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(remindersQuery, (remindersSnapshot) => {
      const reminderCount = {};

      remindersSnapshot.forEach((doc) => {
        const reminder = doc.data();
        const cardName = reminder.cardName || 'Uncategorized';
        if (!reminderCount[cardName]) {
          reminderCount[cardName] = { completed: 0, incomplete: 0 };
        }

        if (reminder.status.toLowerCase() === 'completed' || reminder.status.toLowerCase() === 'done') {
          reminderCount[cardName].completed += 1;
        } else if (reminder.status.toLowerCase() === 'pending') {
          reminderCount[cardName].incomplete += 1;
        }
      });

      setReminderData(reminderCount);
      setLoading(false);
    });

    return () => unsubscribe();
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const screenWidth = Dimensions.get('window').width;

  // Prepare data for the bar chart
  const labels = Object.keys(reminderData);
  const completedData = labels.map(label => reminderData[label].completed);
  const incompleteData = labels.map(label => reminderData[label].incomplete);

  // Prepare data for the pie chart
  const totalReminders = completedData.reduce((a, b) => a + b, 0) + incompleteData.reduce((a, b) => a + b, 0);

  const pieData = labels.map((label, index) => ({
    name: label,
    population: completedData[index] + incompleteData[index],
    color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  }));

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>

        {/* Card for Total Stats */}
        <View style={styles.card}>
          <Text style={styles.headerText}></Text>
          <Text style={styles.totalText}>
            Total Reminders: {totalReminders} {'\n'}
            <Text style={styles.completedText}>Completed: {completedData.reduce((a, b) => a + b, 0)}</Text>{' '}
            <Text style={styles.incompleteText}>Incomplete: {incompleteData.reduce((a, b) => a + b, 0)}</Text>
          </Text>
        </View>

        {/* Bar Chart */}
        <Text style={styles.chartTitle}></Text>
        <BarChart
          data={{
            labels: labels, // X-axis (Card Names)
            datasets: [
              { data: completedData, label: 'Completed', color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})` }, // Green for Completed
              { data: incompleteData, label: 'Incomplete', color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})` }  // Red for Incomplete
            ]
          }}
          width={screenWidth - 40}
          height={300}
          fromZero
          yAxisLabel=""
          yAxisSuffix=""
          yAxisInterval={1} // Category intervals for Y-axis
          chartConfig={{
            backgroundColor: '#1e2923',
            backgroundGradientFrom: '#004d40',
            backgroundGradientTo: '#00796b',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 },
            barPercentage: 0.7,
            propsForBackgroundLines: {
              strokeDasharray: '', // Solid background lines
              strokeWidth: 1.5,
              stroke: '#ccc',
            },
            propsForVerticalLabels: {
              translateX: 10 // Shift X-axis labels to the right
            },
          }}
          verticalLabelRotation={0}
          style={{ marginVertical: 8, borderRadius: 16 }}
          showValuesOnTopOfBars // Show the total number on top of each bar
        />

        {/* Pie Chart */}
        <Text style={styles.chartTitle}>Reminder Status Distribution</Text>
        <PieChart
          data={pieData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#1cc910',
            backgroundGradientFrom: '#eff3ff',
            backgroundGradientTo: '#efefef',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    padding: 20,
    marginBottom: 20,
    width: '100%',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  completedText: {
    color: 'green',
    fontWeight: 'bold',
  },
  incompleteText: {
    color: 'red',
    fontWeight: 'bold',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
    textAlign: 'center',
  },
});

export default StatisticsScreen;
