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
exports.CustomMulter = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
cloudinary_1.default.v2.config({
    cloud_name: 'diiaqomhc',
    api_key: '449374288675671',
    api_secret: 'RiJtvTX7IDrGt-WRedFgi3-UeMc',
});
//* Singleton
class CustomMulter {
    static init() {
        if (!CustomMulter.multerObj) {
            const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
                cloudinary: cloudinary_1.default.v2,
                params: (req, file) => __awaiter(this, void 0, void 0, function* () {
                    return {
                        folder: 'event',
                        format: 'jpeg',
                    };
                }),
            });
            CustomMulter.multerObj = (0, multer_1.default)({ storage: storage });
        }
        return CustomMulter.multerObj;
    }
}
exports.CustomMulter = CustomMulter;
