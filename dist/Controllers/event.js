"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = exports.insert = void 0;
const mongoose_1 = require("mongoose");
//* Models and types
const Event_1 = require("../Models/Event");
//* Rules, policy and error
const policy_1 = require("../policy");
const error_1 = require("../error");
const statusCode_1 = require("./statusCode");
const insert = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let policy = (0, policy_1.checkPolicyFor)(req.user);
    if (policy.cannot('create', 'Event')) {
        next(new error_1.AuthError('You Cannot Create an Event - Please Login First'));
        return;
    }
    //* get payload
    let payload = req.body;
    //* check validity of organizer and category
    if (!mongoose_1.Types.ObjectId.isValid(payload.category)) {
        next(new error_1.ValidationError([{ param: 'category', location: 'body', msg: 'category is not valid' }]));
        return;
    }
    let imagePath;
    if (req.files && req.files.length > 0) {
        imagePath = req.files.map((file) => file.path);
    }
    else {
        imagePath = ['https://res.cloudinary.com/diiaqomhc/image/upload/v1642002402/event/no-iamge-placeholder_g0yxph.jpg'];
    }
    try {
        let event = new Event_1.Event(Object.assign(Object.assign({}, payload), { imagePath, organizer: req.user._id }));
        yield event.save();
        req.user.events.push(event._id);
        yield req.user.save();
        res.status(statusCode_1.HttpStatusCode.OK).json({
            status: 'success',
            data: event,
        });
    }
    catch (error) {
        //! delete uploaded image
        next(error);
    }
});
exports.insert = insert;
const index = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //* filtering
    try {
        let { skip = 0, limit = 5, category = null } = req.query;
        let filter = {};
        if (category && mongoose_1.Types.ObjectId.isValid(category)) {
            filter = Object.assign(Object.assign({}, filter), { category: category });
        }
        //* documents count
        let count = yield Event_1.Event.find().countDocuments();
        let events = yield Event_1.Event.find(filter)
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .populate('category')
            .populate('organizer');
        res.status(statusCode_1.HttpStatusCode.OK).json({
            status: 'success',
            data: events,
            count: count,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.index = index;
