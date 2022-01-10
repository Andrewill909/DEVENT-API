import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { User, UserI } from '../Models/User';
import { config } from '../config';
import { NextFunction, Request, Response } from 'express';
import { JWTError } from '../error';

import { RequestWithUser } from '../Controllers/types';
import { doesNotMatch } from 'assert';

interface TokenInterface {
  _id: string;
  email: string;
}

export async function translateToken(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
  try {
    let userToken: any = req.get('Authorization');

    if (!userToken) {
      next();
      return;
    }

    //? verify jwt token
    const decoded = jwt.verify(userToken, config.secretKey) as TokenInterface;

    req.user = await User.findById(decoded._id);

    if (!req.user) {
      throw new JWTError('No user correlated with token');
    }
    next();
    return;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      next(new JWTError('Expired token'));
    }
    next(error);
  }
}
