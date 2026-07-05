const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobsController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.post('/jobs', requireAuth, requireRole(['Homeowner', 'Admin']), jobsController.createJob);
router.get('/jobs/homeowner/:id', requireAuth, requireRole(['Homeowner', 'Admin']), jobsController.getHomeownerJobs);
router.get('/jobs', requireAuth, jobsController.getAllJobs);
router.get('/jobs/:id', requireAuth, jobsController.getJobById);
router.put('/jobs/:id', requireAuth, requireRole(['Homeowner', 'Admin']), jobsController.updateJob);
router.put('/jobs/:id/status', requireAuth, jobsController.updateJobStatus);
router.put('/jobs/:id/progress', requireAuth, requireRole(['Worker', 'Admin']), jobsController.updateJobProgress);

module.exports = router;
