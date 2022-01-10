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
exports.me = exports.googleCallback = exports.googleUrl = exports.basicLogin = exports.verifyEmail = exports.register = void 0;
//* import core
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("../config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const mustache_1 = __importDefault(require("mustache"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const googleapis_1 = require("googleapis");
const axios_1 = __importDefault(require("axios"));
//* Models
const User_1 = require("../Models/User");
//* Error handling
const error_1 = require("../error");
const statusCode_1 = require("./statusCode");
const url_1 = require("url");
//* mailer
const transport = nodemailer_1.default.createTransport({
    service: config_1.config.emailService,
    auth: {
        user: config_1.config.authUserEmail,
        pass: config_1.config.authUserPassword,
    },
});
//? Routes
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let payload = req.body;
        //? create emailToken
        const emailToken = crypto_1.default.createHmac('sha256', config_1.config.secretKey).update(payload.email).digest('hex');
        //? hash password
        payload.password = yield bcrypt_1.default.hash(payload.password, parseInt(config_1.config.hashRounds));
        let user = new User_1.User(Object.assign(Object.assign({}, payload), { emailToken: emailToken }));
        yield user.save();
        //? send email wihtout awaiting
        fs_1.default.readFile(path_1.default.resolve(config_1.config.rootPath, 'template', 'verifyEmail.html'), { encoding: 'utf-8' }, (err, html) => {
            if (err)
                console.log(err);
            const query = new url_1.URLSearchParams({ emailToken: emailToken }).toString();
            transport
                .sendMail({
                to: payload.email,
                from: config_1.config.authUserEmail,
                subject: 'Email Verification',
                html: mustache_1.default.render(html, { fullName: payload.fullName, request: `${config_1.config.SERVER_URL}/auth/verify-email?${query}` }),
            })
                .then((res) => console.log(res))
                .catch((err) => console.log('transport error', err));
        });
        //* response
        res.status(statusCode_1.HttpStatusCode.CREATED).json({
            status: 'success',
            message: 'Check your email to verify your account',
        });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.register = register;
const verifyEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { emailToken } = req.query;
        const user = yield User_1.User.findOne({ emailToken: emailToken });
        if (!emailToken || !user) {
            res.sendFile(path_1.default.resolve(config_1.config.rootPath, 'template', 'verifyEmailFailed.html'));
            return;
        }
        //? remove emailToken and change status
        user.emailToken = undefined;
        user.status = User_1.Status.active;
        yield user.save();
        //* response
        res.sendFile(path_1.default.resolve(config_1.config.rootPath, 'template', 'verifyEmailSuccess.html'));
    }
    catch (error) {
        next(error);
    }
});
exports.verifyEmail = verifyEmail;
const basicLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.User.findOne({ email: email });
        //* Check user existance and status
        if (!user) {
            throw new error_1.UnprocessableError('User not found');
        }
        else if (user.status !== 'active') {
            throw new error_1.UnprocessableError('You must verify your email first');
        }
        else if (!user.password) {
            //! account exits but with google sign in
            throw new error_1.UnprocessableError('This email is already connected with google account, use google login instead');
        }
        //* check password
        const compare = yield bcrypt_1.default.compare(password, user.password);
        if (!compare) {
            throw new error_1.UnprocessableError('Incorrect password');
        }
        //? create JWT
        //* user without password
        const { _id, fullName, email: em, updatedAt } = user.toJSON();
        const jwtToken = jsonwebtoken_1.default.sign({ _id, fullName, email: em, updatedAt }, config_1.config.secretKey, { expiresIn: '8h' });
        //* send response
        res.status(statusCode_1.HttpStatusCode.OK).json({
            status: 'success',
            message: 'Login successful',
            token: jwtToken,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.basicLogin = basicLogin;
const googleUrl = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oauth2Client = new googleapis_1.google.auth.OAuth2(config_1.config.GOOGLE_CLIENT_ID, config_1.config.GOOGLE_CLIENT_SECRET, `${config_1.config.SERVER_URL}/auth${config_1.config.GOOGLE_REDIRECT_URL}`);
        const scopes = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'];
        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
        });
        res.status(statusCode_1.HttpStatusCode.ACCEPTED).json({
            message: 'Invoke this url for google consent',
            url: url,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.googleUrl = googleUrl;
const googleCallback = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { code } = req.query;
        if (!code)
            return;
        const oauth2Client = new googleapis_1.google.auth.OAuth2(config_1.config.GOOGLE_CLIENT_ID, config_1.config.GOOGLE_CLIENT_SECRET, `${config_1.config.SERVER_URL}/auth${config_1.config.GOOGLE_REDIRECT_URL}`);
        const { tokens: { access_token, refresh_token, scope, id_token }, } = yield oauth2Client.getToken(code);
        //? fetch user profile
        const { id, email, name } = yield axios_1.default.get(`https://www.googleapis.com/userinfo/v2/me?oauth_token=${access_token}`).then((res) => res.data);
        //? serach for exisiting email
        let user = yield User_1.User.findOne({ email: email });
        //TODO check 3 account condition
        //? 1. pure new user (no acc)
        //? 2. already user, first time with google
        //? 3. already user, not first time with google
        //? create new user
        const googleObj = {
            id: id,
            accessToken: access_token,
            //! refresh token only invoked once
            refreshToken: refresh_token,
            map: { lat: 0, lng: 0 },
        };
        if (!user) {
            //1 condition
            user = new User_1.User({ fullName: name, email: email, google: googleObj, status: 'active', loginMethod: User_1.loginMethod.google });
            yield user.save();
        }
        else if (user && !((_a = user.google) === null || _a === void 0 ? void 0 : _a.id)) {
            //2 condition
            user.google = googleObj;
            user.loginMethod = User_1.loginMethod.google;
            yield user.save();
        }
        //? create JWT
        const { _id, fullName, email: em, updatedAt } = user.toJSON();
        const jwtToken = jsonwebtoken_1.default.sign({ _id, fullName, email: em, updatedAt }, config_1.config.secretKey, { expiresIn: '8h' });
        const query = new url_1.URLSearchParams({ token: jwtToken }).toString();
        //* response
        res.redirect(`${config_1.config.CLIENT_URL}/home?${query}`);
    }
    catch (error) {
        next(error);
    }
});
exports.googleCallback = googleCallback;
const me = (req, res, next) => {
    try {
        if (!req.user) {
            throw new error_1.JWTError('Not login or token expired');
        }
        res.json(req.user);
    }
    catch (error) {
        next(error);
    }
};
exports.me = me;
