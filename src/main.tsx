import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { DashboardControllerProvider } from './context';
import App from './App';
import './css/style.css';
import './css/satoshi.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import config from './data/config';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router basename={config.base}>
      <DashboardControllerProvider>
        <App />
      </DashboardControllerProvider>
    </Router>
  </React.StrictMode>,
);
