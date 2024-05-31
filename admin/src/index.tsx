import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/notifications/styles.css';

import { colorsTuple, createTheme, MantineProvider } from '@mantine/core';
import { BrowserRouter, RouterProvider} from "react-router-dom";

import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import 'dayjs/locale/ar';
import { Notifications } from '@mantine/notifications';

dayjs.extend(duration)
dayjs.extend(relativeTime)

const theme = createTheme({
  fontFamily: 'IBM Plex Sans Arabic, sans-serif',
  colors: {
    "tajer-green": colorsTuple('#323232'),
  },
  primaryColor: "tajer-green"
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider theme={theme}>
        <Notifications />
        <App />
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
