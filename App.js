import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from 'react-native-elements';
import { StyleSheet } from 'react-native';
import SignInScreen from './src/Screens/Sign up/Login';
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
          // } else if (route.name === 'Medication') {
          //   iconName = 'medical-bag';
          } else if (route.name === 'Statistics') {
            iconName = 'chart-line';
          } else if (route.name === 'Settings') {
            iconName = 'cog';
          }

          // Icon size increased to 35
          return <Icon name={iconName} type="material-community" color={color} size={30} />;
        },
        tabBarActiveTintColor: 'salmon', // Active tab color
        tabBarInactiveTintColor: 'white', // Inactive tab color
        tabBarStyle: styles.tabBar, // Tab bar styling
        tabBarShowLabel: true, // Show labels below icons
        tabBarLabelStyle: styles.tabLabel, // Label styling
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Home' }} 
      />
      {/* <Tab.Screen 
        name="Medication" 
        component={MedicationScreen} 
        options={{ title: 'Medication' }} 
      /> */}
      <Tab.Screen 
        name="Statistics" 
        component={StatisticsScreen} 
        options={{ title: 'Statistics' }} 
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }} 
      />
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
  tabBar: {
    backgroundColor: 'black', // Tab bar background color
    height: 90, // Increased height of the bottom tabs background
    borderTopWidth: 5, // Top border to give a clean separation
    borderTopColor: '#e0e0e0', // Light grey color for the border
    paddingBottom: 10, // Adds padding at the bottom
    paddingTop: 5, // Adds padding at the top
    borderRadius: 15,
    marginBottom:5
  },
  tabLabel: {
    fontSize: 15, // Small font size for tab labels
    fontWeight: '600', // Bold font for better readability
    marginBottom: 5, // Spacing between label and icon
  },
});
