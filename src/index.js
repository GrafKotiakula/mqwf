import './index.css';
import 'react-datepicker/dist/react-datepicker.css';

import React from 'react';
import * as ReactDOM from 'react-dom/client'

import App from './components/core/App';

const rootContainer = ReactDOM.createRoot( document.getElementById('root') )
rootContainer.render(<App />)
