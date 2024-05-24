// src/Chatbot.js
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, IconButton, Paper, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    maxWidth: '600px',
    margin: '0 auto',
  },
  header: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  chatWindow: {
    flex: 1,
    overflowY: 'auto',
    padding: theme.spacing(2),
    backgroundColor: '#f0f0f0',
  },
  inputContainer: {
    display: 'flex',
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  input: {
    flex: 1,
    marginRight: theme.spacing(2),
  },
  messageUser: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(1),
  },
  messageBot: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: theme.spacing(1),
  },
  messageText: {
    maxWidth: '60%',
    padding: theme.spacing(1.5),
    borderRadius: '20px',
    backgroundColor: theme.palette.grey[300],
  },
  userText: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
}));

const Chatbot = () => {
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const response = await axios.post('http://localhost:5005/webhooks/rest/webhook', { message: input });
      const botMessages = response.data.map(msg => ({ text: msg.text, sender: 'bot' }));
      setMessages([...messages, userMessage, ...botMessages]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  return (
    <Paper className={classes.root} elevation={6}>
      <Typography variant="h5" align="center" className={classes.header}>
        Chat with NutriBot
      </Typography>
      <div className={classes.chatWindow}>
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index} className={msg.sender === 'user' ? classes.messageUser : classes.messageBot}>
              {msg.sender === 'bot' && <Avatar className={classes.avatar}>B</Avatar>}
              <Paper className={`${classes.messageText} ${msg.sender === 'user' ? classes.userText : ''}`}>
                <ListItemText primary={msg.text} />
              </Paper>
            </ListItem>
          ))}
        </List>
      </div>
      <div className={classes.inputContainer}>
        <TextField
          variant="outlined"
          placeholder="Type a message..."
          className={classes.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
        />
        <IconButton color="primary" onClick={handleSend}>
          <SendIcon />
        </IconButton>
      </div>
    </Paper>
  );
};

export default Chatbot;
