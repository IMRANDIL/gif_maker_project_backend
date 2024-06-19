import React,{useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import UploadForm from './components/UploadForm';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';
import { PrivateHandler } from './components/private/PrivateHandler';
import { PublicHandler } from './components/public/PublicHandler';

const App = () => {
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Navigate('/login');
    window.location.reload(); // Refresh the page to update the UI
  };

  return (
    <Router>
      <div className="App" style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
        <header style={{ backgroundColor: '#007bff', padding: '10px 0', color: '#fff', textAlign: 'center', fontSize: '24px', marginBottom: '20px', position: 'relative' }}>
          My Application
          {token && (
            <button onClick={handleLogout} style={{ position: 'absolute', right: '10px', top: '10px', padding: '5px 10px', fontSize: '16px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Logout
            </button>
          )}
        </header>
        <Routes>
          <Route path="/" element={<PrivateHandler>{<UploadForm/>}</PrivateHandler>} />
          <Route path="/login" element={<PublicHandler>{<Login/>}</PublicHandler>} />
          <Route path="/register" element={<PublicHandler>{<Register/>}</PublicHandler>} />
        </Routes>
        <footer style={{ backgroundColor: '#f8f9fa', padding: '10px 0', textAlign: 'center', fontSize: '14px', marginTop: '20px' }}>
          © 2023 My Application, Inc.
        </footer>
      </div>
    </Router>
  );
};

export default App;
