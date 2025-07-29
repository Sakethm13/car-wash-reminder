// src/pages/HomePage.jsx
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Header from '../components/Header.jsx';
import DashboardSummary from '../components/DashboardSummary.jsx';

const HomePage = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#f4f6f8',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden' // ✅ Prevents any horizontal scroll
      }}
    >
      <Header />
      <Container
        maxWidth="lg"
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          px: 2,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Welcome to Car Wash Reminder App 🚗
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
          Automate customer follow-ups and boost your service loyalty!
        </Typography>

        <Box sx={{ mt: 5, width: '100%' }}>
          <DashboardSummary />
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
