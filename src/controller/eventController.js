const eventModel = require('../models/eventModel');
const { isValid, isValidRequestBody, isValidObjectId } = require('../utils/validator');


const createEvent = async (req, res) => {
    try {
        const requestBody = req.body;

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Invalid request parameters. Please provide Event details" })
        }
        const { eventName, description, date, createdBy, invitees } = requestBody;

        if (!isValid(eventName)) {
            return res.status(400).send({ status: false, message: "eventName is required" });
        }
        if (!isValid(description)) {
            return res.status(400).send({ status: false, message: "description is required" });
        }
        if (!isValid(date)) {
            return res.status(400).send({ status: false, message: "date is required" });
        }
        if (!isValid(createdBy)) {
            return res.status(400).send({ status: false, message: "createdBy is required" });
        }
        if (!isValidObjectId(createdBy)) {
            return res.status(400).send({ status: false, message: "Only objectId allowed" });
        }
        if (!isValid(invitees)) {
            return res.status(400).send({ status: false, message: "invitees is required" });
        }

        const eventData = {
            eventName: eventName, description: description, date: date, createdBy: createdBy, invitees: invitees
        };
        const eventCreated = await eventModel.create(eventData);
        return res.status(201).send({ status: true, message: 'Event created successfully', data: eventCreated });


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

module.exports = { createEvent };