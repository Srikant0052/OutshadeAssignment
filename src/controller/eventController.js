const eventModel = require('../models/eventModel');
const { isValid, isValidRequestBody, isValidObjectId } = require('../utils/validator');


const createEvent = async (req, res) => {
    try {
        const requestBody = req.body;

        //Basic user validations
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

        // Creating event and also adding invitee
        const eventCreated = await (await eventModel.create(eventData)).populate(['invitees', 'createdBy']);
        return res.status(201).send({ status: true, message: 'Event created successfully', data: eventCreated });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

const invite = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Only objectId is allowed " });
        }

        const eventList = await eventModel.find({ createdBy: userId }).select({ _id: 0, createdAt: 0, updatedAt: 0, __v: 0 })
        return res.status(200).send({ status: true, message: "Success", data: eventList })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = { createEvent, invite };