import mongoose, { Schema, model, Types } from 'mongoose';

export interface EventI {
  name: string;
  price: string;
  description: string;
  imagePath: string[];
  capacity: {
    max: number;
    current: number;
  };
  organizer: Types.ObjectId;
  startTime: string;
  endTime: string;
  category: Types.ObjectId;
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
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startTime: {
    type: String,
    default: new Date().toISOString(),
  },
  endTime: {
    type: String,
    default: new Date().toISOString(),
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
});

const Event = model<EventI>('Event', eventSchema);

export { Event };
