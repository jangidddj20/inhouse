const express = require('express');
const router = express.Router();
const geminiController = require('../controllers/geminiController');

// Generate event plan
router.post('/generate-event-plan', geminiController.generateEventPlan);

// Generate poster content
router.post('/generate-poster', geminiController.generatePosterContent);

// Generate email draft
router.post('/generate-email', geminiController.generateEmailDraft);

// Generate Instagram caption
router.post('/generate-caption', geminiController.generateInstagramCaption);

// Generate all materials at once
router.post('/generate-all', geminiController.generateAllMaterials);

module.exports = router;
