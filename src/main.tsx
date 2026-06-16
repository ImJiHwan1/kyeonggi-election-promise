import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Global styles
import './styles/style.css';
import './styles/contents.css';
import './styles/layout.css';
import './styles/layout_01.css';

// Common component styles
// import '@components/common/CustomScrollbar/styles.css';
// import '@components/common/SearchableSelect/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
