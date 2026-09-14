import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { SocketProvider } from './context/SocketContext';
import { AlertProvider } from './context/AlertContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <AlertProvider>
          <App />
        </AlertProvider>
      </SocketProvider>
    </BrowserRouter>
  </React.StrictMode>
);
