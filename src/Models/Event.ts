import mongoose, { Schema, model, Types } from 'mongoose';

export interface EventI {
  name: string;
  price: string;
  description: string;
  imagePath: string[];
  videoPath: string[];
  capacity: {
    max: number;
    current: number;
  };
  organizer: Types.ObjectId;
  startTime: Date;
  endTime: Date;
}

const eventSchema = new Schema<EventI>({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imagePath: [
    {
      type: String,
    },
  ],
  videoPath: [
    {
      type: String,
    },
  ],
  capacity: {
    max: {
      type: Number,
      default: 50,
    },
    current: {
      type: Number,
      default: 0,
    },
  },
  organizer: {
    type: 'ObjectId',
    ref: 'User',
    required: true,
  },
  startTime: {
    type: Date,
    default: new Date(),
  },
  endTime: {
    type: Date,
    default: new Date(),
  },
});

const Event = model<EventI>('Event', eventSchema);

export { Event };
