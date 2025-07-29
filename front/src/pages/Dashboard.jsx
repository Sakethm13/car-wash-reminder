// front/src/pages/Dashboard.js

import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalCustomers: 0,
    totalReminders: 0,
    smsSentToday: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('/dashboard');
        setDashboardData(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
    };

    fetchDashboardData();
  }, []);

  const cardData = [
    {
      label: 'Total Customers',
      value: dashboardData.totalCustomers,
      color: '#1976d2',
    },
    {
      label: 'Total Reminders',
      value: dashboardData.totalReminders,
      color: '#9c27b0',
    },
    {
      label: 'SMS Sent Today',
      value: dashboardData.smsSentToday,
      color: '#cddc39',
      textColor: '#000',
    },
  ];

  return (
    <Box p={4} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3} justifyContent="center" mt={1}>
        {cardData.map((card, idx) => (
          <Grid item xs={12} sm={4} md={3} key={idx}>
            <Paper
              elevation={4}
              sx={{
                p: 3,
                backgroundColor: card.color,
                color: card.textColor || '#fff',
                textAlign: 'center',
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" fontWeight="medium">
                {card.label}
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {card.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box mt={4} display="flex" gap={2}>
        <Button variant="contained" onClick={() => navigate('/add-customer')}>
          Add Customer
        </Button>
        <Button variant="outlined" onClick={() => navigate('/view-customers')}>
          View Customers
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
