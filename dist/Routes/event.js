"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRouter = void 0;
const express_1 = require("express");
const CustomMulter_1 = require("../Api/CustomMulter");
const event_1 = require("../Controllers/event");
const express_validator_1 = require("express-validator");
//* Erorr Handling
const validate_1 = require("../Helper/validate");
const router = (0, express_1.Router)();
exports.EventRouter = router;
router.post('/events', CustomMulter_1.CustomMulter.init().array('image'), (0, validate_1.validateAll)([
    (0, express_validator_1.body)('name').exists().withMessage('name must be filled').isLength({ min: 3 }).withMessage('name must be at least 3 chars long'),
    (0, express_validator_1.body)('category').exists().withMessage('category id must be filled').isLength({ min: 5 }).withMessage('category id must be at least 3 chars long'),
    (0, express_validator_1.body)('price').exists().withMessage('price must be filled').isNumeric().withMessage('price must be numeric values'),
    (0, express_validator_1.body)('description').exists().withMessage('description must be filled').isLength({ min: 10 }).withMessage('description must be at least 3 chars long'),
    (0, express_validator_1.body)('capacity').exists().withMessage('capacity must be filled').isNumeric().withMessage('capacity must be numeric values'),
    (0, express_validator_1.body)('startTime').exists().withMessage('start time must be filled').isISO8601().withMessage('start date must use valid date time ISO8601 format'),
    (0, express_validator_1.body)('endTime').exists().withMessage('end time must be filled').isISO8601().withMessage('end date must use valid date time ISO8601 format'),
]), event_1.insert);
router.get('/events', event_1.index);
