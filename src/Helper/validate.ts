import { ValidationChain, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
//* Error Handling
import { ValidationError } from '../error';

export const validateSequentially = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    //! Error Occured
    next(new ValidationError(errors.array({ onlyFirstError: true })));
  };
};

export const validateAll = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.allSettled(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    //! Error Ocurred
    next(new ValidationError(errors.array({ onlyFirstError: true })));
  };
};
