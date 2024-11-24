const Joi = require('joi');

const eventSchema = Joi.object({
    eventType: Joi.string().required(),
    sourceApplicationId: Joi.string().required(),
    dataPayload: Joi.object().required(),
    timestamp: Joi.date().default(Date.now)
});

const validateEvent = (req, res, next) => {
    const { error } = eventSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = { validateEvent };