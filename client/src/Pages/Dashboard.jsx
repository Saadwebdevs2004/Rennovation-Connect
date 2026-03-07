import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom shadow-sm">
        <div className="container-fluid">
            <Link className="navbar-brand" to="/dashboard">
                <span className="h4 mb-0">🛠️ Renovation Connect</span>
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <Link className="nav-link active" to="/dashboard">My Dashboard</Link>
                    </li>
                    <li className="nav-item">
                        {/* We will build this page next! */}
                        <Link className="nav-link btn btn-accent text-dark fw-bold" to="/post-task">Post New Task</Link>
                    </li>
                    <li className="nav-item">
                        {/* Logs the user out by sending them back to the login screen */}
                        <Link className="nav-link" to="/">Logout</Link>
                    </li>
                </ul>
            </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container my-5">
        <h1 className="mb-4 text-primary">🏡 Welcome Back, Homeowner!</h1>
        <p className="lead">View your current tasks, bids received, and start a new renovation project.</p>

        {/* Post Task Call to Action */}
        <div className="p-4 mb-4 bg-white shadow-sm border border-accent rounded">
            <h4 className="mb-3">Ready to start a new project?</h4>
            <Link to="/post-task" className="btn btn-accent btn-lg text-dark fw-bold">
                ➕ Post a New Renovation Task
            </Link>
        </div>

        <hr />

        <h2 className="mb-3 text-secondary">My Active Tasks (Awaiting Bids)</h2>
        
        {/* Task Card 1 */}
        <div className="card shadow-sm mb-3 border-start border-primary border-5">
            <div className="card-body">
                <div className="row align-items-center">
                    <div className="col-md-8">
                        <h5 className="card-title text-primary">Tiling Project for Master Bathroom</h5>
                        <p className="card-text text-muted mb-1">Posted: 2 hours ago | Budget: $800 - $1200</p>
                        <p className="card-text">Need a skilled tiler for 50 sq ft bathroom floor and wall. Materials provided.</p>
                    </div>
                    <div className="col-md-4 text-end">
                        <span className="badge bg-success fs-6">3 Bids Received</span>
                        <Link to="/view-bids" className="btn btn-primary btn-sm mt-2 w-100">View & Compare Bids</Link>
                    </div>
                </div>
            </div>
        </div>

        {/* Task Card 2 */}
        <div className="card shadow-sm mb-3 border-start border-danger border-5">
            <div className="card-body">
                <div className="row align-items-center">
                    <div className="col-md-8">
                        <h5 className="card-title text-danger">Exterior House Painting - 2 Story</h5>
                        <p className="card-text text-muted mb-1">Posted: Yesterday | Budget: $4000 - $5500</p>
                        <p className="card-text">Full exterior paint job required. Must provide own ladders and scaffolding.</p>
                    </div>
                    <div className="col-md-4 text-end">
                        <span className="badge bg-secondary fs-6">0 Bids Yet</span>
                        <button className="btn btn-secondary btn-sm mt-2 w-100" disabled>Waiting for Bids</button>
                    </div>
                </div>
            </div>
        </div>

        <div className="alert alert-info text-center" role="alert">
            No completed or pending tasks yet. **Post your first task above!**
        </div>

      </div>
    </>
  );
};

export default Dashboard;