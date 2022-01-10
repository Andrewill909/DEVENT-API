"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceSpecialChars = void 0;
const replaceSpecialChars = (b64string) => {
    return b64string.replace(/[=+/]/g, (charToBeReplaced) => {
        switch (charToBeReplaced) {
            case '=':
                return '';
            case '+':
                return '-';
            case '/':
                return '_';
            default:
                return charToBeReplaced;
        }
    });
};
exports.replaceSpecialChars = replaceSpecialChars;
