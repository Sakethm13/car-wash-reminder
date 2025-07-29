import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  CircularProgress,
  Box,
  Stack,
} from '@mui/material';
import axios from '../api/axios';
import carwashImage from '../assets/carwash-man.jpg';

const DashboardSummary = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalReminders, setTotalReminders] = useState(0);
  const [smsSentToday, setSmsSentToday] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [customerRes, reminderRes] = await Promise.all([
          axios.get('/customers'),
          axios.get('/reminders'),
        ]);

        console.log('Customer API Response:', customerRes.data);
        console.log('Reminder API Response:', reminderRes.data);

        // Flexible extraction logic for customers
        const customers = Array.isArray(customerRes.data)
          ? customerRes.data
          : Array.isArray(customerRes.data.customers)
          ? customerRes.data.customers
          : Array.isArray(customerRes.data.data)
          ? customerRes.data.data
          : [];

        // Flexible extraction logic for reminders
        const reminders = Array.isArray(reminderRes.data)
          ? reminderRes.data
          : Array.isArray(reminderRes.data.data)
          ? reminderRes.data.data
          : [];

        const todayDate = new Date().toISOString().split('T')[0];

        const todayReminders = reminders.filter(
          (r) => r.date && r.date.startsWith(todayDate)
        );

        setTotalCustomers(customers.length);
        setTotalReminders(reminders.length);
        setSmsSentToday(todayReminders.length);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: 'Total Customers',
      value: totalCustomers,
      gradient: 'linear-gradient(to right, #00c6ff, #0072ff)',
    },
    {
      title: 'Total Reminders',
      value: totalReminders,
      gradient: 'linear-gradient(to right, #ff6a00, #ee0979)',
    },
    {
      title: 'SMS Sent Today',
      value: smsSentToday,
      gradient: 'linear-gradient(to right, #00b09b, #96c93d)',
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={4}
        alignItems="stretch"
      >
        {/* Stats Column */}
        <Stack spacing={3} flex={1}>
          {stats.map((item, index) => (
            <Paper
              key={index}
              elevation={6}
              sx={{
                p: 4,
                textAlign: 'center',
                background: item.gradient,
                color: '#fff',
                borderRadius: 4,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: '600' }}>
                {item.title}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
                {item.value}
              </Typography>
            </Paper>
          ))}
        </Stack>

        {/* Image Box */}
        <Box
          flex={1}
          sx={{
            minHeight: 350,
            borderRadius: 4,
            backgroundImage: `url(${carwashImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: 3,
          }}
        />
      </Box>
    </Box>
  );
};

export default DashboardSummary;
