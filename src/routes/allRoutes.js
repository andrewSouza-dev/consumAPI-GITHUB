const express = require('express');
const {
  status,
  syncCommitsController,
  listCommitsController,
  listRepositoriesController
} = require('./controllers/commitController');

const router = express.Router();

router.get('/', status);
router.post('/sync-commits', syncCommitsController);
router.get('/commits', listCommitsController);
router.get('/repositories', listRepositoriesController);

module.exports = router;
