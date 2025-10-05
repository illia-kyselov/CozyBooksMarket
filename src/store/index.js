import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ordersReducer from './ordersSlice';
import shelfReducer from './shelfSlice';
import readBooksReducer from './readBooksSlice';
import quizReducer from './quizSlice';
import settingsReducer from './settingsSlice';

const rootReducer = combineReducers({
  orders: ordersReducer,
  shelf: shelfReducer,
  readBooks: readBooksReducer,
  quiz: quizReducer,
  settings: settingsReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['orders', 'shelf', 'readBooks', 'quiz', 'settings'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
