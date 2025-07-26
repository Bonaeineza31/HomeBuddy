// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nationality: { type: String },
  gender: { type: String },
  bio: { type: String },
  budget: { type: String },
  preference: { type: String },
  hobbies: { type: [String], default: [] },
  photo: { type: String },
  role: { type: String, enum: ["student", "admin"], default: "student" },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  tokens: [
    {
      token: { type: String, required: true }
    }
  ]
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Generate auth token
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

// Remove sensitive data from JSON response
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.tokens;
  return user;
};

const User = mongoose.model("User", userSchema);

export default User;
