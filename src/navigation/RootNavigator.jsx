import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainScreen from '../screens/MainScreen';
import BookInfoScreen from '../screens/BookInfoScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import MyOrdersScreen from '../screens/MyOrdersScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MyBooksScreen from '../screens/MyBooksScreen';
import AddBookScreen from '../screens/AddBookScreen';
import QuizScreen from '../screens/QuizScreen';
import DevInfoScreen from '../screens/DevInfoScreen';
import CurrencyAndRegionScreen from '../screens/CurrencyAndRegionScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="MyBooks" component={MyBooksScreen} />
      <Stack.Screen name="BookInfo" component={BookInfoScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="AddBook" component={AddBookScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="DevInfo" component={DevInfoScreen} />
      <Stack.Screen name="CurrencyAndRegion" component={CurrencyAndRegionScreen} />
    </Stack.Navigator>
  );
}
