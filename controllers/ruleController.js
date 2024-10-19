const Rule = require('../models/Rule');

// Helper function to create AST from rule string
function parseRuleString(ruleString) {
    // Simplified parsing for illustration (use a parser or tokenizer for complex cases)
    // This should split the string and create the AST node objects
    if (ruleString.includes('AND')) {
        const [left, right] = ruleString.split('AND').map(s => s.trim());
        return new Rule({
            type: 'operator',
            left: parseRuleString(left),
            right: parseRuleString(right),
            value: 'AND'
        });
    } else if (ruleString.includes('OR')) {
        const [left, right] = ruleString.split('OR').map(s => s.trim());
        return new Rule({
            type: 'operator',
            left: parseRuleString(left),
            right: parseRuleString(right),
            value: 'OR'
        });
    } else {
        // Base case: it's a condition (operand)
        return new Rule({
            type: 'operand',
            value: ruleString
        });
    }
}

// Create rule from string
const createRule = async (req, res) => {
    const ruleString = req.body.rule;
    try {
        const ast = parseRuleString(ruleString);
        await ast.save();
        res.json(ast);
    } catch (err) {
        res.status(400).json({ error: 'Error parsing rule string' });
    }
};

// Combine rules
const combineRules = async (req, res) => {
    try {
        const rules = req.body.rules;  // Array of rule strings
        const combinedAst = rules.reduce((combined, ruleString) => {
            const ast = parseRuleString(ruleString);
            return new Rule({
                type: 'operator',
                left: combined,
                right: ast,
                value: 'AND'  // Example: combining with AND, can be adjusted
            });
        }, null);
        res.json(combinedAst);
    } catch (err) {
        res.status(400).json({ error: 'Error combining rules' });
    }
};

// Evaluate rule
const evaluateRule = async (req, res) => {
    const { ast, data } = req.body;
    try {
        const result = evaluateAST(ast, data);
        res.json({ result });
    } catch (err) {
        res.status(400).json({ error: 'Error evaluating rule' });
    }
};

// Helper function to evaluate AST
function evaluateAST(ast, data) {
    if (ast.type === 'operator') {
        const leftResult = evaluateAST(ast.left, data);
        const rightResult = evaluateAST(ast.right, data);
        if (ast.value === 'AND') {
            return leftResult && rightResult;
        } else if (ast.value === 'OR') {
            return leftResult || rightResult;
        }
    } else if (ast.type === 'operand') {
        // Simplified condition evaluation (e.g., "age > 30")
        const [attribute, operator, value] = ast.value.split(' ');
        switch (operator) {
            case '>':
                return data[attribute] > parseInt(value, 10);
            case '<':
                return data[attribute] < parseInt(value, 10);
            case '=':
                return data[attribute] === value;
            default:
                return false;
        }
    }
    return false;
}

module.exports = { createRule, combineRules, evaluateRule };
