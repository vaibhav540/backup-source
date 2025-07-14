import { createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { chatReducer, reducer } from "./reducers";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);
const rootReducer = combineReducers({
  account: persistedReducer, // Persisted
  chat: chatReducer, // Not Persisted
});
const store = createStore(rootReducer);

const persistor = persistStore(store);

export { store, persistor };
