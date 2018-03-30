import * as mongoose from "mongoose";
let Schema = mongoose.Schema;

let userSchema = new Schema({
  username: { type: String, required: true },
  subscriber: { type: Boolean, default: false },
  following: { type: Boolean, default: false },
  points: { type: Number, default: 0 },       // Current number of points, can be subtracted for certain commands
  earnedPoints: { type: Number, default: 0 }  // Total number of earned points, never gets decremented
});

// Compile the schema into a model
export const User = mongoose.model('User', userSchema);