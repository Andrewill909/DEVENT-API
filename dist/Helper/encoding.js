"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUTF8 = exports.toBase64 = void 0;
const toBase64 = (obj) => {
    const str = JSON.stringify(obj);
    return Buffer.from(str).toString('base64');
};
exports.toBase64 = toBase64;
const toUTF8 = (ent) => {
    return Buffer.from(ent).toString('utf-8');
};
exports.toUTF8 = toUTF8;
