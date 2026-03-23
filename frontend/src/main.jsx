import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import store from './app/store.js';
import { applyTheme, getPreferredTheme } from './utils/theme.js';

applyTheme(getPreferredTheme());

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
