// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddCustomer from './pages/AddCustomer';
import CustomerPage from './pages/CustomerPage';
import Dashboard from './pages/Dashboard.jsx'; 
import RemindersPage from './pages/RemindersPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add-customer" element={<AddCustomer />} />
        <Route path="/add" element={<AddCustomer />} />
        <Route path="/customers" element={<CustomerPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reminders" element={<RemindersPage />} />
      </Routes>
    </Router>
  );
}

export default App;
