import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Global styles
import '../public/css/style.css';
import '../public/css/contents.css';
import '../public/css/layout.css';

// Common component styles
// import '@components/common/CustomScrollbar/styles.css';
// import '@components/common/SearchableSelect/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
