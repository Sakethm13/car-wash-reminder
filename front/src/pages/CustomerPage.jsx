// src/pages/CustomerPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from '../api/axios';

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedCustomer, setEditedCustomer] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get('/customers'); // ✅ FIXED
        setCustomers(res.data.customers || []);
      } catch (err) {
        console.error('Error fetching customers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleEditClick = (customer) => {
    setEditingId(customer._id);
    setEditedCustomer({ ...customer });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedCustomer({});
  };

  const handleSaveEdit = async () => {
    try {
      const res = await axios.put(`/customers/${editingId}`, editedCustomer); // ✅ FIXED
      const updatedList = customers.map((c) =>
        c._id === editingId ? res.data.customer || editedCustomer : c
      );
      setCustomers(updatedList);
      setEditingId(null);
      setEditedCustomer({});
    } catch (error) {
      console.error('Failed to update customer:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/customers/${id}`); // ✅ FIXED
      setCustomers(customers.filter((c) => c._id !== id));
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  const handleChange = (field, value) => {
    setEditedCustomer({ ...editedCustomer, [field]: value });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCustomers = customers.filter((customer) => {
    const term = searchTerm.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(term) ||
      customer.phone?.toLowerCase().includes(term) ||
      customer.vehicleNumber?.toLowerCase().includes(term)
    );
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0]; // yyyy-mm-dd
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Customer List
      </Typography>

      <TextField
        fullWidth
        label="Search by name, phone or vehicle"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 3 }}
      />

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Vehicle Number</strong></TableCell>
              <TableCell><strong>Next Visit</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((c) => (
              <TableRow key={c._id}>
                <TableCell>
                  {editingId === c._id ? (
                    <TextField
                      value={editedCustomer.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      size="small"
                    />
                  ) : (
                    c.name
                  )}
                </TableCell>
                <TableCell>
                  {editingId === c._id ? (
                    <TextField
                      value={editedCustomer.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      size="small"
                    />
                  ) : (
                    c.phone
                  )}
                </TableCell>
                <TableCell>
                  {editingId === c._id ? (
                    <TextField
                      value={editedCustomer.vehicleNumber || ''}
                      onChange={(e) => handleChange('vehicleNumber', e.target.value)}
                      size="small"
                    />
                  ) : (
                    c.vehicleNumber || '—'
                  )}
                </TableCell>
                <TableCell>
                  {editingId === c._id ? (
                    <TextField
                      type="date"
                      value={formatDate(editedCustomer.nextVisitDate)}
                      onChange={(e) => handleChange('nextVisitDate', e.target.value)}
                      size="small"
                    />
                  ) : (
                    formatDate(c.nextVisitDate)
                  )}
                </TableCell>
                <TableCell>
                  {editingId === c._id ? (
                    <>
                      <IconButton onClick={handleSaveEdit} color="primary">
                        <SaveIcon />
                      </IconButton>
                      <IconButton onClick={handleCancelEdit} color="secondary">
                        <CancelIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton onClick={() => handleEditClick(c)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(c._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
};

export default CustomerPage;
