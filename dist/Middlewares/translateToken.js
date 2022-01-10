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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../Models/User");
const config_1 = require("../config");
const error_1 = require("../error");
function translateToken() {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userToken = req.headers['Authorization'];
                console.log('user token', userToken);
                if (!userToken) {
                    next();
                    return;
                }
                //? verify jwt token
                const decoded = jsonwebtoken_1.default.verify(userToken, config_1.config.secretKey);
                req.user = yield User_1.User.findById(decoded._id);
                console.log('user', req.user);
                if (!req.user) {
                    throw new error_1.JWTError('No user correlated with token');
                }
            }
            catch (error) {
                if (error.name === 'TokenExpiredError') {
                    next(new error_1.JWTError('Expired token'));
                }
            }
            next();
        });
    };
}
exports.translateToken = translateToken;
