import { Router } from 'express';
import { basicLogin, register, verifyEmail, googleUrl, googleCallback, me } from '../Controllers/auth';
import { body, query } from 'express-validator';
import { User, Gender } from '../Models/User';
import { config } from '../config';
//* Error handling
import { validateAll } from '../Helper/validate';

const router = Router();

//? register
router.post(
  '/register',
  validateAll([
    body('email')
      .exists()
      .withMessage('Email must be filled')
      .isString()
      .matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      .withMessage('Please enter a valid email address')
      .custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) throw new Error('Email already exist, choose login instead');
      }),
    body('password')
      .exists()
      .withMessage('Password must be filled')
      .isString()
      .isLength({ min: 5, max: 255 })
      .withMessage('Password must be at least 5 chars long')
      .matches(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[a-z]).*$/)
      .withMessage('Passoword must contain at least one uppercased and special character'),
    body('confirm-password').custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
    body('fullName').exists().withMessage('Full name must be filled').isLength({ min: 3 }).withMessage('Full name must be at least 3 chars long'),
    body('phone').exists().withMessage('Phone must be filled').isLength({ min: 10 }).withMessage('Phone must be at least 10 chars long'),
    body('address').exists().withMessage('Address name must be filled').isLength({ min: 10 }).withMessage('Address must be at least 10 chars long'),
    body('gender').exists().withMessage('Gender must be filled').isIn([Gender.male, Gender.female]).withMessage('Gender are either male or female'),
  ]),
  register
);

router.get('/verify-email', validateAll([query('emailToken').exists().withMessage('not valid request')]), verifyEmail);

//? login
router.post('/login', validateAll([body('email').exists().withMessage('Email must be filled').isString(), body('password').exists().withMessage('Passowrd must be filled')]), basicLogin);

router.get('/login/google/url', googleUrl);

router.get(config.GOOGLE_REDIRECT_URL, googleCallback);

router.get('/me', me);

export { router as AuthRouter };
