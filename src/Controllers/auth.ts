//* import core
import fs from 'fs';
import path from 'path';
import { Response, NextFunction, Request } from 'express';
import crypto from 'crypto';
import { config } from '../config';
import nodemailer from 'nodemailer';
import mustache from 'mustache';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { google } from 'googleapis';
import axios from 'axios';

//* Models
import { User, UserI, Status, loginMethod } from '../Models/User';

//* Error handling
import { UnprocessableError, JWTError } from '../error';

//* types and interfaces
import { CustomRequestBody, RequestWithUser } from './types';
import { HttpStatusCode } from './statusCode';
import { URLSearchParams } from 'url';

//* mailer
const transport = nodemailer.createTransport({
  service: config.emailService,
  auth: {
    user: config.authUserEmail,
    pass: config.authUserPassword,
  },
});

//* types
export interface Login {
  email: string;
  password: string;
}

export interface GoogleData {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

//? Routes
export const register = async (req: CustomRequestBody<UserI>, res: Response, next: NextFunction): Promise<void> => {
  try {
    let payload = req.body;
    //? create emailToken
    const emailToken = crypto.createHmac('sha256', config.secretKey).update(payload.email).digest('hex');

    //? hash password
    payload.password = await bcrypt.hash(payload.password, parseInt(config.hashRounds));

    let user = new User({ ...payload, emailToken: emailToken });
    await user.save();

    //? send email wihtout awaiting
    fs.readFile(path.resolve(config.rootPath, 'template', 'verifyEmail.html'), { encoding: 'utf-8' }, (err, html) => {
      if (err) console.log(err);
      const query = new URLSearchParams({ emailToken: emailToken }).toString();
      transport
        .sendMail({
          to: payload.email,
          from: config.authUserEmail,
          subject: 'Email Verification',
          html: mustache.render(html, { fullName: payload.fullName, request: `${config.SERVER_URL}/auth/verify-email?${query}` }),
        })
        .then((res) => console.log(res))
        .catch((err) => console.log('transport error', err));
    });

    //* response
    res.status(HttpStatusCode.CREATED).json({
      status: 'success',
      message: 'Check your email to verify your account',
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { emailToken } = req.query;

    const user = await User.findOne({ emailToken: emailToken as string });
    if (!emailToken || !user) {
      res.sendFile(path.resolve(config.rootPath, 'template', 'verifyEmailFailed.html'));
      return;
    }
    //? remove emailToken and change status
    user.emailToken = undefined;
    user.status = Status.active;
    await user.save();

    //* response
    res.sendFile(path.resolve(config.rootPath, 'template', 'verifyEmailSuccess.html'));
  } catch (error) {
    next(error);
  }
};

export const basicLogin = async (req: CustomRequestBody<Login>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    //* Check user existance and status
    if (!user) {
      throw new UnprocessableError('User not found');
    } else if (user.status !== 'active') {
      throw new UnprocessableError('You must verify your email first');
    } else if (!user.password) {
      //! account exits but with google sign in
      throw new UnprocessableError('This email is already connected with google account, use google login instead');
    }

    //* check password
    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      throw new UnprocessableError('Incorrect password');
    }

    //? create JWT
    //* user without password
    const { _id, fullName, email: em, updatedAt } = user.toJSON();

    const jwtToken = jsonwebtoken.sign({ _id, fullName, email: em, updatedAt }, config.secretKey, { expiresIn: '8h' });

    res.cookie('auth_token', jwtToken, {
      httpOnly: false,
      secure: false,
    });

    //* send response
    // res.redirect(`${config.CLIENT_URL}/home`);
    res.status(HttpStatusCode.OK).json({
      status: 'success',
      message: 'Login successful',
    });
  } catch (error) {
    next(error);
  }
};

export const googleUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const oauth2Client = new google.auth.OAuth2(config.GOOGLE_CLIENT_ID, config.GOOGLE_CLIENT_SECRET, `${config.SERVER_URL}/auth${config.GOOGLE_REDIRECT_URL}`);
    const scopes = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'];

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });

    res.status(HttpStatusCode.ACCEPTED).json({
      message: 'Invoke this url for google consent',
      url: url,
    });
  } catch (error) {
    next(error);
  }
};

export const googleCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { code } = req.query;
    if (!code) return;
    const oauth2Client = new google.auth.OAuth2(config.GOOGLE_CLIENT_ID, config.GOOGLE_CLIENT_SECRET, `${config.SERVER_URL}/auth${config.GOOGLE_REDIRECT_URL}`);
    const {
      tokens: { access_token, refresh_token, scope, id_token },
    } = await oauth2Client.getToken(code as string);

    //? fetch user profile
    const { id, email, name } = await axios.get<GoogleData>(`https://www.googleapis.com/userinfo/v2/me?oauth_token=${access_token}`).then((res) => res.data);

    //? serach for exisiting email
    let user = await User.findOne({ email: email });

    //TODO check 3 account condition
    //? 1. pure new user (no acc)
    //? 2. already user, first time with google
    //? 3. already user, not first time with google

    //? create new user
    const googleObj = {
      id: id,
      accessToken: access_token,
      //! refresh token only invoked once
      refreshToken: refresh_token,
      map: { lat: 0, lng: 0 },
    };

    if (!user) {
      //1 condition
      user = new User({ fullName: name, email: email, google: googleObj, status: 'active', loginMethod: loginMethod.google });
      await user.save();
    } else if (user && !user.google?.id) {
      //2 condition
      user.google = googleObj;
      user.loginMethod = loginMethod.google;
      await user.save();
    }

    //? create JWT
    const { _id, fullName, email: em, updatedAt } = user.toJSON();

    const jwtToken = jsonwebtoken.sign({ _id, fullName, email: em, updatedAt }, config.secretKey, { expiresIn: '8h' });

    //* set cookie
    res.cookie('auth_token', jwtToken, {
      httpOnly: false,
      secure: false,
    });

    //* response
    res.redirect(`${config.CLIENT_URL}/home`);
  } catch (error) {
    next(error);
  }
};

export const me = (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new JWTError('Not login or token expired');
    }
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};
