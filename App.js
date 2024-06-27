import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from 'react-native-elements';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import SignInScreen from './src/Screens/Login/Login';
import SignUpScreen from './src/Screens/Sign up/SignUp';
import WelcomeScreen from './src/Screens/Welcome/Welcome';
import HomeScreen from './src/Screens/Home/Home';
import MedicationScreen from './src/Screens/Medication/Medication';
import StatisticsScreen from './src/Screens/Statistics/Statistics';
import SettingsScreen from './src/Screens/Settings/Settings';
import TodoScreen from './src/Screens/Todo/Todo';
import WorkScreen from './src/Screens/Work/Work';
import ShoppingScreen from './src/Screens/Shopping/Shopping';




const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Medication') {
            iconName = 'medical-bag';
          } else if (route.name === 'Statistics') {
            iconName = 'chart-line';
          } else if (route.name === 'Settings') {
            iconName = 'cog';
          }

          return <Icon name={iconName} type="material-community" color={color} size={size} />;
        },
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Medication" component={MedicationScreen} />
      <Tab.Screen
        name="Add"
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity {...props} style={styles.addButton}>
              <Icon name="plus" type="material-community" color="#fff" size={30} />
            </TouchableOpacity>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            // Handle the action of the add button here
            console.log('Add button pressed');
          },
        })}
      >
        {() => null}
      </Tab.Screen>
      <Tab.Screen name="Statistics" component={StatisticsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="ToDo"
          component={TodoScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="Work"
          component={WorkScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="Shopping"
          component={ShoppingScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  addButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4a90e2',
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 5,
  },
});
