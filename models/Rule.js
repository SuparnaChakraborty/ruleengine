const mongoose = require('mongoose');

const NodeSchema = new mongoose.Schema({
    type: String,
    left: { type: mongoose.Schema.Types.Mixed, default: null },
    right: { type: mongoose.Schema.Types.Mixed, default: null },
    value: { type: String, default: null }
});

const Rule = mongoose.model('Rule', NodeSchema);
module.exports = Rule;
