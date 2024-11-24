
const Joi = require('joi');

const eventSchema = Joi.object({
    eventType: Joi.string()
        .required()
        .trim()
        .messages({
            'string.empty': 'Event type cannot be empty',
            'any.required': 'Event type is required'
        }),
    
    sourceApplicationId: Joi.string()
        .required()
        .trim()
        .messages({
            'string.empty': 'Source application ID cannot be empty',
            'any.required': 'Source application ID is required'
        }),
    
    dataPayload: Joi.object()
        .required()
        .messages({
            'object.base': 'Data payload must be a valid JSON object',
            'any.required': 'Data payload is required'
        }),
    
    timestamp: Joi.date()
        .default(Date.now)
        .messages({
            'date.base': 'Timestamp must be a valid date'
        })
});

const validateEvent = (req, res, next) => {
    const { error, value } = eventSchema.validate(req.body, {
        abortEarly: false,  // Collect all errors, not just the first one
        stripUnknown: true  // Remove unknown fields
    });

    if (error) {
        // Format validation errors
        const errorDetails = error.details.reduce((acc, err) => {
            const key = err.path[0];
            acc[key] = err.message;
            return acc;
        }, {});


        // Return detailed error response
        return res.status(400).json({
            error: 'Validation Error',
            details: errorDetails
        });
    }

    // Replace req.body with validated and sanitized values
    req.body = value;
    next();
};

module.exports = validateEvent;