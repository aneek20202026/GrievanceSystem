// store.js
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import citizenSlice from "./CitizenSlice";
import adminSlice from "./AdminSlice";
import officialSlice from "./OfficialSlice";
import authSlice from "./AuthSlice";
import { createRoot } from 'react-dom/client'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

const rootRuducers = combineReducers({
  admin: adminSlice,
  official: officialSlice,
  citizen: citizenSlice,
  auth: authSlice
})
const persistedReducer = persistReducer(persistConfig, rootRuducers)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
});

export default store;
