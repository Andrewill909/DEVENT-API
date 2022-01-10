"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.loginMethod = exports.Status = exports.Role = exports.Gender = void 0;
const mongoose_1 = __importStar(require("mongoose"));
//* types and interfaces
var Gender;
(function (Gender) {
    Gender["male"] = "male";
    Gender["female"] = "female";
})(Gender = exports.Gender || (exports.Gender = {}));
var Role;
(function (Role) {
    Role["user"] = "user";
    Role["admin"] = "admin";
})(Role = exports.Role || (exports.Role = {}));
var Status;
(function (Status) {
    Status["active"] = "active";
    Status["pending"] = "pending";
    Status["blocked"] = "blocked";
})(Status = exports.Status || (exports.Status = {}));
var loginMethod;
(function (loginMethod) {
    loginMethod["google"] = "google";
    loginMethod["basic"] = "basic";
})(loginMethod = exports.loginMethod || (exports.loginMethod = {}));
const userSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
    },
    gender: {
        type: String,
        enum: Object.values(Gender),
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.pending,
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.user,
    },
    google: {
        id: String,
        accessToken: String,
        refreshToken: String,
        map: {
            lat: Number,
            lng: Number,
        },
    },
    loginMethod: {
        type: String,
        enum: Object.values(loginMethod),
        default: loginMethod.basic,
    },
    events: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Event',
        },
    ],
    emailToken: String,
    resetToken: mongoose_1.Schema.Types.Mixed,
}, {
    timestamps: true,
});
//* instance methods, statics, query helpers
//* validation
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
