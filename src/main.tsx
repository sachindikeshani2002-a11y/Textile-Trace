import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {Toaster} from 'sonner';
import {Provider} from './store';
import App from './App';
import './styles.css';
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter><Provider><App/><Toaster position="bottom-right" richColors/></Provider></BrowserRouter></React.StrictMode>);
