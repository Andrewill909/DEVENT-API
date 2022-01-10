"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._db = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
mongoose_1.default.connect(config_1.config.dbConnString);
let _db = mongoose_1.default.connection;
exports._db = _db;
