import mongoose, { Schema, Model, Types } from 'mongoose';

//* types and interfaces
export enum Gender {
  male = 'male',
  female = 'female',
}

export enum Role {
  user = 'user',
  admin = 'admin',
}

export enum Status {
  active = 'active',
  pending = 'pending',
  blocked = 'blocked',
}

export enum loginMethod {
  google = 'google',
  basic = 'basic',
}

export interface UserI extends mongoose.Document {
  _id: Types.ObjectId;
  fullName: string;
  gender: Gender;
  phone: string;
  address: string;
  email: string;
  password: string;
  status: Status;
  role: Role;
  google: {
    id: string;
    accessToken: string | null | undefined;
    refreshToken: string | null | undefined;
    map: {
      lat: Number | null;
      lng: Number | null;
    };
  };
  loginMethod: loginMethod;
  events: Types.ObjectId[];
  token: string[];
  emailToken?: String;
  resetToken: any;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<UserI, Model<UserI>>(
  {
    fullName: {
      type: String,
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.pending,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.user,
    },
    google: {
      id: String,
      accessToken: String,
      refreshToken: String,
      map: {
        lat: Number,
        lng: Number,
      },
    },
    loginMethod: {
      type: String,
      enum: Object.values(loginMethod),
      default: loginMethod.basic,
    },
    events: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
    emailToken: String,
    resetToken: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

//* instance methods, statics, query helpers

//* validation

const User = mongoose.model<UserI>('User', userSchema);

export { User };
