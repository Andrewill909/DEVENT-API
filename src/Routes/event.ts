import express, { Router } from 'express';
import { CustomMulter } from '../Api/CustomMulter';
import { insert } from '../Controllers/event';
import { body } from 'express-validator';
//* Erorr Handling
import { validateAll } from '../Helper/validate';

const router = Router();

router.post(
  '/events',
  CustomMulter.init().array('image'),
  validateAll([
    body('name').exists().withMessage('name must be filled').isLength({ min: 3 }).withMessage('name must be at least 3 chars long'),
    body('category').exists().withMessage('category id must be filled').isLength({ min: 5 }).withMessage('category id must be at least 3 chars long'),
    body('price').exists().withMessage('price must be filled').isNumeric().withMessage('price must be numeric values'),
    body('description').exists().withMessage('description must be filled').isLength({ min: 10 }).withMessage('description must be at least 3 chars long'),
    body('capacity').exists().withMessage('capacity must be filled').isNumeric().withMessage('capacity must be numeric values'),
    body('startTime').exists().withMessage('start time must be filled').isISO8601().withMessage('start date must use valid date time ISO8601 format'),
    body('endTime').exists().withMessage('end time must be filled').isISO8601().withMessage('end date must use valid date time ISO8601 format'),
  ]),
  insert
);

export { router as EventRouter };
