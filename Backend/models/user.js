import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'landlord', 'admin'], default: 'student' },
  profile: {
    name: String,
    phone: String,
    university: String
  },
  tokens: [
    {
      token: { type: String, required: true }
    }
  ]
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

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
