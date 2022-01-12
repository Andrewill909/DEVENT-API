import express, { Request, Response, NextFunction, Express } from 'express';
import { checkPolicyFor } from '../policy';
//* Models
import { Category, CategoryI } from '../Models/Category';
import { RequestWithUser } from './types';
//* Error handling
import { AuthError } from '../error';
import { HttpStatusCode } from './statusCode';

export const index = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    let categories = await Category.find();

    res.status(HttpStatusCode.OK).json({
      status: 'success',
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
