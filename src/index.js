import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1565c0',   // deep blue for brand
    },
    secondary: {
      main: '#ff9800',   // orange accent
    },
    background: {
      default: '#f4f6f8', // light gray background
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    h5: {
      fontWeight: 700,
      letterSpacing: '0.5px',
    },
    body2: {
      color: '#555',
    },
  },
  shape: {
    borderRadius: 12, // rounded corners for all components
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // keep button text normal case
          borderRadius: 8,
          padding: '10px 20px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
        },
      },
    },
  },
});


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
