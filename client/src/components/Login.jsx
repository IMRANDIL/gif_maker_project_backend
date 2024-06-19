import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css'; // Assuming a separate CSS file for styling

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3001/api/users/login', {
        email,
        password
      });
      const { token } = response.data;
      localStorage.setItem('token', token); // Store token in localStorage
      setLoading(false);
      navigate('/payment');
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.status === 404) {
        toast.error('User not found. Redirecting to registration...');
        setTimeout(() => navigate('/register'), 3000); // Redirect to register if user not found
      } else {
        setError(err.response.data.message || 'Something went wrong');
      }
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <h2 className="login-title">Login</h2>
      {error && <p className="login-error">{error}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <button type="submit" disabled={loading} className="login-button">
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="login-switch">
          New user? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
