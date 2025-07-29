// src/pages/AddCustomer.jsx
import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import axios from '../api/axios';

function AddCustomer() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [nextVisitDate, setNextVisitDate] = useState(dayjs());

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCustomer = {
        name,
        phone,
        nextVisitDate: nextVisitDate.format('YYYY-MM-DD'), // Ensure correct format
      };

      await axios.post('/api/customers', newCustomer);
      alert('Customer added and SMS sent!');

      // Reset form
      setName('');
      setPhone('');
      setNextVisitDate(dayjs());
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Failed to add customer.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Add New Customer
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Customer Name"
            variant="outlined"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Mobile Number"
            variant="outlined"
            fullWidth
            required
            type="tel"
            inputProps={{ maxLength: 10 }}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <DatePicker
            label="Next Visit Date"
            value={nextVisitDate}
            onChange={(newValue) => setNextVisitDate(newValue)}
            format="YYYY-MM-DD"
            slotProps={{ textField: { fullWidth: true } }}
          />
          <Button type="submit" variant="contained" color="primary">
            Add Customer
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default AddCustomer;
