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
exports.AuthRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../Controllers/auth");
const express_validator_1 = require("express-validator");
const User_1 = require("../Models/User");
const config_1 = require("../config");
//* Error handling
const validate_1 = require("../Helper/validate");
const router = (0, express_1.Router)();
exports.AuthRouter = router;
//? register
router.post('/register', (0, validate_1.validateAll)([
    (0, express_validator_1.body)('email')
        .exists()
        .withMessage('Email must be filled')
        .isString()
        .matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        .withMessage('Please enter a valid email address')
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield User_1.User.findOne({ email: value });
        if (user)
            throw new Error('Email already exist, choose login instead');
    })),
    (0, express_validator_1.body)('password')
        .exists()
        .withMessage('Password must be filled')
        .isString()
        .isLength({ min: 5, max: 255 })
        .withMessage('Password must be at least 5 chars long')
        .matches(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[a-z]).*$/)
        .withMessage('Passoword must contain at least one uppercased and special character'),
    (0, express_validator_1.body)('confirm-password').custom((val, { req }) => {
        if (val !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
    (0, express_validator_1.body)('fullName').exists().withMessage('Full name must be filled').isLength({ min: 3 }).withMessage('Full name must be at least 3 chars long'),
    (0, express_validator_1.body)('phone').exists().withMessage('Phone must be filled').isLength({ min: 10 }).withMessage('Phone must be at least 10 chars long'),
    (0, express_validator_1.body)('address').exists().withMessage('Address name must be filled').isLength({ min: 10 }).withMessage('Address must be at least 10 chars long'),
    (0, express_validator_1.body)('gender').exists().withMessage('Gender must be filled').isIn([User_1.Gender.male, User_1.Gender.female]).withMessage('Gender are either male or female'),
]), auth_1.register);
router.get('/verify-email', (0, validate_1.validateAll)([(0, express_validator_1.query)('emailToken').exists().withMessage('not valid request')]), auth_1.verifyEmail);
//? login
router.post('/login', (0, validate_1.validateAll)([(0, express_validator_1.body)('email').exists().withMessage('Email must be filled').isString(), (0, express_validator_1.body)('password').exists().withMessage('Passowrd must be filled')]), auth_1.basicLogin);
router.get('/login/google/url', auth_1.googleUrl);
router.get(config_1.config.GOOGLE_REDIRECT_URL, auth_1.googleCallback);
router.get('/me', auth_1.me);
