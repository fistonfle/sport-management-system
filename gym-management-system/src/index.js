import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Ensure you have your CSS file set up correctly
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you don't need performance monitoring, you can safely remove this function
reportWebVitals();
