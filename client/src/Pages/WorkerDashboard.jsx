import React from 'react';
import { Link } from 'react-router-dom';

const WorkerDashboard = () => {
  return (
    <>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom shadow-sm">
        <div className="container-fluid">
            <Link className="navbar-brand" to="/worker-dashboard">
                <span className="h4 mb-0">🛠️ Renovation Connect</span>
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <Link className="nav-link active" to="/worker-dashboard">My Dashboard</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/worker-profile">My Profile</Link>
                    </li>
                    <li className="nav-item">
                        {/* Logs the user out by sending them back to the login screen */}
                        <Link className="nav-link btn btn-accent fw-bold" to="/">Logout</Link>
                    </li>
                </ul>
            </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container my-5">
        <h1 className="mb-4 text-primary">👷 Welcome Back, Skilled Worker!</h1>
        <p className="lead text-secondary">Find new projects and manage your active bids.</p>
        
        {/* Search and Filter Section */}
        <div className="p-3 mb-4 bg-white shadow-sm rounded">
            <h5 className="mb-3">Find Jobs by Category or Location</h5>
            <div className="row">
                <div className="col-md-5 mb-2 mb-md-0">
                    {/* Note: React requires self-closing tags for inputs */}
                    <input type="text" className="form-control" placeholder="Search by City or Keyword..." />
                </div>
                <div className="col-md-5 mb-2 mb-md-0">
                    {/* Note: React uses defaultValue instead of selected on options */}
                    <select className="form-select" defaultValue="Filter by Trade (e.g., Plumbing)">
                        <option disabled>Filter by Trade (e.g., Plumbing)</option>
                        <option>Electrical</option>
                        <option>Painting</option>
                        <option>Carpentry</option>
                    </select>
                </div>
                <div className="col-md-2">
                    <button className="btn btn-primary w-100">Search</button>
                </div>
            </div>
        </div>

        <hr />

        <h2 className="mb-3 text-secondary">Available Tasks in Your Area</h2>
        
        {/* Task Card 1 */}
        <div className="card shadow-sm mb-3 border-start border-primary border-5">
            <div className="card-body">
                <div className="row align-items-center">
                    <div className="col-md-8">
                        <span className="badge bg-primary text-white mb-2">Plumbing</span>
                        <h5 className="card-title text-primary">Urgent Leak Repair - Kitchen Faucet</h5>
                        <p className="card-text text-muted mb-1">Location: Lahore, Gulberg | Budget Range: $200 - $350</p>
                        <p className="card-text">Faucet replacement needed urgently. Homeowner will purchase the new faucet beforehand.</p>
                    </div>
                    <div className="col-md-4 text-end">
                        <span className="badge bg-secondary fs-6 mb-2">No Bids Yet!</span>
                        <Link to="/place-bid" className="btn btn-accent btn-sm mt-2 w-100 fw-bold">Place Your Bid</Link>
                    </div>
                </div>
            </div>
        </div>

        {/* Task Card 2 */}
        <div className="card shadow-sm mb-3 border-start border-warning border-5">
            <div className="card-body">
                <div className="row align-items-center">
                    <div className="col-md-8">
                        <span className="badge bg-primary text-white mb-2">Painting (Interior)</span>
                        <h5 className="card-title text-warning">Repaint Two Bedroom Walls</h5>
                        <p className="card-text text-muted mb-1">Location: Rawalpindi, Satellite Town | Budget Range: $600 - $900</p>
                        <p className="card-text">Standard two-coat repainting for two average-sized bedrooms. Homeowner supplies paint.</p>
                    </div>
                    <div className="col-md-4 text-end">
                        <span className="badge bg-info fs-6 mb-2">5 Bids Placed</span>
                        <Link to="/place-bid" className="btn btn-secondary btn-sm mt-2 w-100">Review Bid Details</Link>
                    </div>
                </div>
            </div>
        </div>

        <div className="alert alert-info text-center mt-4" role="alert">
            No more tasks matching your location. Check back later or adjust your search filters!
        </div>

      </div>
    </>
  );
};

export default WorkerDashboard;