// import { configureStore } from '@reduxjs/toolkit';
// import userReducer from './userSlice';

// const store = configureStore({
//   reducer: {
//     user: userReducer,
//   },
// });

 
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import storage from 'redux-persist/lib/storage'; // uses localStorage
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';


const persistConfig = {
  key: 'root',
  storage,
};

 
const rootReducer = combineReducers({
  user: userReducer,
});

 
const persistedReducer = persistReducer(persistConfig, rootReducer);

 
const store = configureStore({
  reducer: persistedReducer,
});

 
export const persistor = persistStore(store);

export default store;
