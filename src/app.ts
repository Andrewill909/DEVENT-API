import http from 'http';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import debug from 'debug';
import cookieParser from 'cookie-parser';
import { AuthRouter } from './Routes/auth';
import { EventRouter } from './Routes/event';
import { CategoryRouter } from './Routes/category';

//* Error handler
import { errorMiddleware } from './error';

//* initial setup and parser
import { _db } from './Database';
const debugging = debug('devent:server');

//* middlewares
import { translateToken } from './Middlewares/translateToken';

const app = express();
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: function (origin, callback) {
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 200,
    maxAge: 86400,
  })
);
app.use(translateToken);

//* routing
app.use('/auth', AuthRouter);
app.use('/api', EventRouter);
app.use('/api', CategoryRouter);

//* error middleware
app.use(errorMiddleware);

//? server configuration
let port = process.env.PORT || 5000;
const server = http.createServer(app);

_db.on('open', () => {
  server.listen(port);
  server.on('listening', () => {
    let address = server.address();
    let bind = typeof address === 'string' ? `pipe ${address}` : `port ${address?.port}`;
    debugging(`Database is connected, Listening on ${bind}`);
  });
  server.on('error', (error: NodeJS.ErrnoException) => {
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

_db.on('error', () => {
  console.log('Could not connect to database');
});
