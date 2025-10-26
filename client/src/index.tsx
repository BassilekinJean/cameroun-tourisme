import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './keycloak';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  < ReactKeycloakProvider authClient={keycloak}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ReactKeycloakProvider>
);