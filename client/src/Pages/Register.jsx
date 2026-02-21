import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  // 1. Create a state to hold the form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    userRole: 'homeowner' // default role
  });

  // 2. Function to update state when you type
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Function to send data to your Node.js server when you click Submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    
    try {
      // Send a POST request to your backend API
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration Successful! 🎉 You can now log in.');
        // Clear the form after success
        setFormData({ fullName: '', email: '', password: '', userRole: 'homeowner' });
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to the server. Is your Node.js backend running?');
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
                        <Link className="nav-link active" to="/register">Register</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link btn btn-accent fw-bold text-dark ms-2" to="/">Login</Link>
                    </li>
                </ul>
            </div>
        </div>
      </nav>

      <div className="container mt-5 mb-5">
        <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
                <div className="card p-5 shadow-lg border-0">
                    <h2 className="card-title text-center mb-4 text-primary">Join Our Platform</h2>
                    <p className="text-center text-muted">Register as a <span className="fw-bold">Homeowner</span> to post tasks or as a <span className="fw-bold">Worker</span> to find jobs.</p>

                    {/* Notice the onSubmit event added here */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 p-3 border rounded bg-light">
                            <label className="form-label d-block fw-bold text-dark mb-2">Select Your Role:</label>
                            <div className="d-flex justify-content-around">
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="userRole" id="roleHomeowner" value="homeowner" checked={formData.userRole === 'homeowner'} onChange={handleChange} required />
                                    <label className="form-check-label fw-bold" htmlFor="roleHomeowner">🏡 Homeowner</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="userRole" id="roleWorker" value="worker" checked={formData.userRole === 'worker'} onChange={handleChange} />
                                    <label className="form-check-label fw-bold" htmlFor="roleWorker">🛠️ Skilled Worker</label>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="fullName" className="form-label">Full Name</label>
                            {/* Added name and value attributes */}
                            <input type="text" className="form-control" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Create Password</label>
                            <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} required />
                        </div>
                        
                        <button type="submit" className="btn btn-primary w-100 mb-3 fw-bold">Create Account</button>
                        
                        <div className="text-center">
                            <Link to="/" className="text-decoration-none text-muted">Already have an account? Log in.</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default Register;