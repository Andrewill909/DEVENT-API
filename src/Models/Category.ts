import mongoose, { Schema, model, Types } from 'mongoose';

export interface CategoryI {
  name: string;
}

let categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const Category = model<CategoryI>('Category', categorySchema);

export { Category };
