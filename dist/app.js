"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const debug_1 = __importDefault(require("debug"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = require("./Routes/auth");
//* Error handler
const error_1 = require("./error");
//* initial setup and parser
const Database_1 = require("./Database");
const debugging = (0, debug_1.default)('devent:server');
//* middlewares
const translateToken_1 = require("./Middlewares/translateToken");
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 200,
    maxAge: 86400,
}));
app.use((0, translateToken_1.translateToken)());
//* routing
app.use('/auth', auth_1.AuthRouter);
//* error middleware
app.use(error_1.errorMiddleware);
//? server configuration
let port = process.env.PORT || 5000;
const server = http_1.default.createServer(app);
Database_1._db.on('open', () => {
    server.listen(port);
    server.on('listening', () => {
        let address = server.address();
        let bind = typeof address === 'string' ? `pipe ${address}` : `port ${address === null || address === void 0 ? void 0 : address.port}`;
        debugging(`Database is connected, Listening on ${bind}`);
    });
    server.on('error', (error) => {
        if (error.syscall !== 'listen') {
            throw error;
        }
        var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
            default:
                throw error;
        }
    });
});
Database_1._db.on('error', () => {
    console.log('Could not connect to database');
});
