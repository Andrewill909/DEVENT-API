import { Request } from 'express';
import { UserI } from '../Models/User';

export interface CustomRequestBody<T = any> extends Request {
  body: T;
}

export interface RequestWithUser extends Request {
  user?: UserI | null;
}
