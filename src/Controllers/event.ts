import express, { Request, Response, NextFunction, Express } from 'express';
import mongoose, { Types } from 'mongoose';
import path from 'path';
import fs, { FileChangeInfo } from 'fs/promises';
import { config } from '../config';

//* Models and types
import { Event, EventI } from '../Models/Event';
import { Category, CategoryI } from '../Models/Category';
import { RequestWithUser } from './types';

//* Rules, policy and error
import { checkPolicyFor } from '../policy';
import { BaseError, AuthError, ValidationError } from '../error';
import { HttpStatusCode } from './statusCode';

export const insert = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  let policy = checkPolicyFor(req.user);
  if (policy.cannot('create', 'Event')) {
    next(new AuthError('You Cannot Create an Event - Please Login First'));
    return;
  }
  //* get payload
  let payload: EventI = req.body;
  //* check validity of organizer and category
  if (!Types.ObjectId.isValid(payload.category)) {
    next(new ValidationError([{ param: 'category', location: 'body', msg: 'category is not valid' }]));
    return;
  }

  let imagePath;
  if (req.files && req.files.length > 0) {
    imagePath = (req.files as any).map((file: Express.Multer.File) => file.path);
  } else {
    imagePath = ['https://res.cloudinary.com/diiaqomhc/image/upload/v1642002402/event/no-iamge-placeholder_g0yxph.jpg'];
  }
  try {
    let event = new Event({ ...payload, imagePath, organizer: req.user!._id });
    await event.save();

    res.status(HttpStatusCode.OK).json({
      status: 'success',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};
