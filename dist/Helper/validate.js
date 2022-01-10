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
exports.validateAll = exports.validateSequentially = void 0;
const express_validator_1 = require("express-validator");
//* Error Handling
const error_1 = require("../error");
const validateSequentially = (validations) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        for (let validation of validations) {
            const result = yield validation.run(req);
            if (!result.isEmpty())
                break;
        }
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        //! Error Occured
        next(new error_1.ValidationError(errors.array({ onlyFirstError: true })));
    });
};
exports.validateSequentially = validateSequentially;
const validateAll = (validations) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.allSettled(validations.map((validation) => validation.run(req)));
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        //! Error Ocurred
        next(new error_1.ValidationError(errors.array({ onlyFirstError: true })));
    });
};
exports.validateAll = validateAll;
