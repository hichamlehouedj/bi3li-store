import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { ColorSchemeScript, createTheme, MantineProvider } from '@mantine/core';
import { BrowserRouter, RouterProvider} from "react-router-dom";

import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import 'react-lazy-load-image-component/src/effects/blur.css';

const theme = createTheme({
  fontFamily: 'IBM Plex Sans Arabic, sans-serif',
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <script> console.log("hi!") </script>
    <BrowserRouter>
      <MantineProvider theme={theme}>
        <App />
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
