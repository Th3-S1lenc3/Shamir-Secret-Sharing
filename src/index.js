import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import AppContextProvider from './components/AppContext';
import Navbar from './components/Navbar';
import Main from './components/Main';


ReactDOM.render(
  <React.StrictMode>
    <AppContextProvider>
      <Navbar />
      <Main />
    </AppContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
