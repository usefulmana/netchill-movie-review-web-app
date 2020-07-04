import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './Responsive.css';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter as Router } from 'react-router-dom';

// react-alert library test
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

const Root = () => (
    <AlertProvider template={AlertTemplate}>
        <App />
    </AlertProvider>
)


ReactDOM.render(
    <Router>
        <Root>
            <App />
        </Root>
    </Router>,
    document.getElementById('root')
);

