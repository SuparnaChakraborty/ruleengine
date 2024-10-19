const express = require('express');
const { createRule, combineRules, evaluateRule } = require('../controllers/ruleController');
const router = express.Router();

router.post('/create_rule', createRule);
router.post('/combine_rules', combineRules);
router.post('/evaluate_rule', evaluateRule);

module.exports = router;
