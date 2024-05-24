// src/App.js
import React from 'react';
import Chatbot from './Chatbot';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#128C7E',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Chatbot />
      </div>
    </ThemeProvider>
  );
}

export default App;
