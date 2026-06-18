import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './styles/contents.css';
import './styles/layout.css';
import './styles/style.css';

// Common component styles
// import '@components/common/CustomScrollbar/styles.css';
// import '@components/common/SearchableSelect/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
