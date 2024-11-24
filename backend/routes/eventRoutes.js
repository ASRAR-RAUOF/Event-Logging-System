const express = require('express');
const router = express.Router();
const EventLog = require('../models/eventLog');
const { validateEvent } = require('../middlewares/validation');
const { generateHash } = require('../utils/hashGenerator');

// Create Event Log
router.post('/', validateEvent, async (req, res) => {
    try {
        const lastEvent = await EventLog.findOne().sort({ timestamp: -1 });
        const previousHash = lastEvent ? lastEvent.hash : '0';

        const eventData = {
            ...req.body,
            timestamp: new Date(req.body.timestamp || Date.now())
        };
        const hash = generateHash({ ...eventData, previousHash });

        const event = new EventLog({
            ...eventData,
            hash,
            previousHash
        });

        await event.save();
        res.status(201).json(event);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Query Events
router.get('/', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            eventType, 
            sourceApplicationId, 
            startDate, 
            endDate 
        } = req.query;

        const query = {};
        if (eventType) query.eventType = eventType;
        if (sourceApplicationId) query.sourceApplicationId = sourceApplicationId;
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        const events = await EventLog
            .find(query)
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await EventLog.countDocuments(query);

        res.json({
            events,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Verify Chain
router.get('/verify', async (req, res) => {
    try {
        const events = await EventLog.find().sort({ timestamp: 1 });
        let isValid = true;
        let previousHash = '0';

        for (const event of events) {
            const calculatedHash = generateHash({
                eventType: event.eventType,
                sourceApplicationId: event.sourceApplicationId,
                dataPayload: event.dataPayload,
                timestamp: event.timestamp,
                previousHash: event.previousHash
            });

            if (event.previousHash !== previousHash || event.hash !== calculatedHash) {
                isValid = false;
                break;
            }

            previousHash = event.hash;
        }

        res.json({ isValid });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
