import mongoose from 'mongoose';
import { config } from '../config';

mongoose.connect(config.dbConnString);
let _db = mongoose.connection;

export { _db };
