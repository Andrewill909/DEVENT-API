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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    startTime: {
        type: String,
        default: new Date().toISOString(),
    },
    endTime: {
        type: String,
        default: new Date().toISOString(),
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
});
const Event = (0, mongoose_1.model)('Event', eventSchema);
exports.Event = Event;
