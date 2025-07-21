// F:\IncomeSense\client\src\main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// Remove the BrowserRouter import if it's there:
// import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App /> {/* Only render the App component directly */}
  </React.StrictMode>,
);