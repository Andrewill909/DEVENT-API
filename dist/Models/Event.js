"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const mongoose_1 = require("mongoose");
const eventSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imagePath: [
        {
            type: String,
        },
    ],
    videoPath: [
        {
            type: String,
        },
    ],
    capacity: {
        max: {
            type: Number,
            default: 50,
        },
        current: {
            type: Number,
            default: 0,
        },
    },
    organizer: {
        type: 'ObjectId',
        ref: 'User',
        required: true,
    },
    startTime: {
        type: Date,
        default: new Date(),
    },
    endTime: {
        type: Date,
        default: new Date(),
    },
});
const Event = (0, mongoose_1.model)('Event', eventSchema);
exports.Event = Event;
