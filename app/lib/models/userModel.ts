import { Schema, model, models } from 'mongoose';

// create schema
const UserSchema = new Schema(
  {
    email: { type: 'string', required: true, unique: true },
    username: { type: 'string', required: true, unique: true },
    password: { type: 'string', required: true },
  },
  {
    timestamps: true,
  }
);

// create Model using above schema (if there isn't already one)
const User = models.User || model('User', UserSchema);

export default User;
