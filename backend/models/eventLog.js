const mongoose = require('mongoose');

const eventLogSchema = new mongoose.Schema({
    eventType: String,
    sourceApplicationId: String,
    dataPayload: Object,
    timestamp: Date,
    hash: String,
    previousHash: String
});

module.exports = mongoose.model('EventLog', eventLogSchema);