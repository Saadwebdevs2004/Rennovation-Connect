import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  // State to hold the email and password
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  // Update state when you type
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Send data to the server to verify
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // 1. Save the user's data into the browser's memory!
        localStorage.setItem('user', JSON.stringify(data.user));

        // 2. The Traffic Cop: Check their role and teleport them to the right dashboard
        if (data.user.role === 'Worker') {
            navigate('/worker-dashboard');
        } else {
            navigate('/dashboard'); // Send Homeowners here
        }
      } else {
        // Wrong password or email
        alert('Login Failed: ' + data.error);
      }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to connect to the server.');
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom shadow-sm">
        <div className="container-fluid">
            <Link className="navbar-brand" to="/">
                <span className="h4 mb-0">🛠️ Renovation Connect</span>
            </Link>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/register">Register</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link btn btn-accent fw-bold text-dark" to="/">Login</Link>
                    </li>
                </ul>
            </div>
        </div>
      </nav>

      <div className="container mt-5">
        <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
                <div className="card p-4 shadow-lg border-0">
                    <h2 className="card-title text-center mb-4 text-primary">Log In</h2>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} required />
                        </div>
                        
                        <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>
                        
                        <div className="text-center">
                            <Link to="/register" className="text-decoration-none text-muted">Don't have an account? Register here.</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default Login;