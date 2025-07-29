// src/components/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Car Wash Reminder
        </Typography>
        <Box>
          <Button color="inherit" href="/">Home</Button>
          <Button color="inherit" href="/add">Add Customer</Button>
          <Button color="inherit" href="/customers">Customers</Button>
          <Button color="inherit" href="/reminders">Reminders</Button>
          <Button color="inherit" href="/dashboard">Dashboard</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
