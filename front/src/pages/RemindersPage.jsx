// front/src/pages/Reminders.js
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Button,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [filter, setFilter] = useState('all');

  const fetchReminders = async () => {
    try {
      const res = await axios.get('/reminders');
      setReminders(res.data.data || []);
    } catch (err) {
      console.error('❌ Error fetching reminders:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/reminders/${id}`);
      setReminders((prev) => prev.filter((rem) => rem._id !== id));
    } catch (err) {
      console.error('❌ Error deleting reminder:', err);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const getFilteredReminders = () => {
    const today = new Date().toISOString().split("T")[0];

    if (filter === 'upcoming') {
      return reminders.filter((r) => r.date >= today);
    } else if (filter === 'past') {
      return reminders.filter((r) => r.date < today);
    }
    return reminders;
  };

  const filtered = getFilteredReminders();

  return (
    <Container>
      <Typography variant="h4" align="center" mt={4} gutterBottom>
        📅 Reminder List
      </Typography>

      <Stack direction="row" spacing={2} justifyContent="center" mt={2} mb={4}>
        <Button
          variant={filter === 'all' ? 'contained' : 'outlined'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'upcoming' ? 'contained' : 'outlined'}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </Button>
        <Button
          variant={filter === 'past' ? 'contained' : 'outlined'}
          onClick={() => setFilter('past')}
        >
          Past
        </Button>
      </Stack>

      {filtered.length === 0 ? (
        <Typography align="center" color="text.secondary">
          No reminders to show.
        </Typography>
      ) : (
        <Grid container spacing={2} justifyContent="center">
          {filtered.map((reminder) => (
            <Grid item xs={12} md={6} lg={4} key={reminder._id}>
              <Card sx={{ backgroundColor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant="h6">{reminder.name}</Typography>
                  <Typography variant="body2">📞 {reminder.phone}</Typography>
                  <Typography variant="body2">📆 {reminder.date}</Typography>
                  <Typography variant="body2">⏰ {reminder.time}</Typography>
                  <Box textAlign="right">
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDelete(reminder._id)}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Reminders;
