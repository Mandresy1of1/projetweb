import React from 'react';
import ReactDOM from 'react-dom/client'; // Importez createRoot depuis react-dom/client
import App from './App';
import { PossessionProvider } from './components/PossessionContext';

const root = ReactDOM.createRoot(document.getElementById('root')); // Créez le root avec createRoot
root.render(
  <React.StrictMode>
    <PossessionProvider>
      <App />
    </PossessionProvider>
  </React.StrictMode>
);
