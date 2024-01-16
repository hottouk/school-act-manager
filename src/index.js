import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'normalize.css';
import reportWebVitals from './reportWebVitals';
//구글
import { GoogleOAuthProvider } from "@react-oauth/google";
// ReduxToolkit
import { Provider } from 'react-redux'
import store from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
//전역변수(안씀)
// import { AuthContextProvider } from './context/AuthContext';

export let persistor = persistStore(store)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <GoogleOAuthProvider clientId={process.env.GOOGLE_ID}>
        {/* <AuthContextProvider> */}
          <App />
        {/* </AuthContextProvider> */}
      </GoogleOAuthProvider>
    </PersistGate>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
