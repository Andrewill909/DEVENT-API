"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = exports.JWTError = exports.UnprocessableError = exports.ValidationError = exports.BaseError = void 0;
const statusCode_1 = require("./Controllers/statusCode");
class BaseError extends Error {
    constructor(name, description, statusCode, isOperational) {
        super(description);
        //? restore prototype chain
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this);
    }
}
exports.BaseError = BaseError;
class ValidationError extends BaseError {
    constructor(details, name, description) {
        name = name || 'Client Error';
        description = description || 'BAD_REQUEST';
        super(name, description, statusCode_1.HttpStatusCode.BAD_REQUEST, true);
        this.details = details || [{ msg: 'no additional information' }];
    }
}
exports.ValidationError = ValidationError;
class UnprocessableError extends BaseError {
    constructor(detail, name, description) {
        name = name || 'Client Error';
        description = description || 'UNPROCESSABLE_ENTITY';
        super(name, description, statusCode_1.HttpStatusCode.UNPROCESSABLE_ENTITY, true);
        this.detail = detail || 'no additional information';
    }
}
exports.UnprocessableError = UnprocessableError;
class JWTError extends BaseError {
    constructor(detail, name, description) {
        name = name || 'Token Error';
        description = description || 'UNAUTHORIZED';
        super(name, description, statusCode_1.HttpStatusCode.UNAUTHORIZED, true);
        this.detail = detail || 'no additional information';
    }
}
exports.JWTError = JWTError;
//? Default error handler
function errorMiddleware(error, req, res, next) {
    console.log(JSON.stringify(error));
    if (error instanceof ValidationError) {
        res.status(error.statusCode).json({
            error: error.name,
            message: error.message,
            details: error.details,
        });
    }
    else if (error instanceof UnprocessableError || error instanceof JWTError) {
        res.status(error.statusCode).json({
            error: error.name,
            message: error.message,
            details: error.detail,
        });
    }
    else {
        res.status(statusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            error: 1,
            message: error.message,
        });
    }
    return;
}
exports.errorMiddleware = errorMiddleware;
