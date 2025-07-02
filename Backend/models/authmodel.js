import mongoose from 'mongoose';

// Define the schema for a User
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures that the email is unique
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'admin'], // Can be extended with more roles if needed
    },
    university: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    idType: {
      type: String,
      required: true,
    },
    idDocument: {
      type: String,
      required: true,
    },
    criminalRecord: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true } 
);


const User = mongoose.model('User', userSchema);

export default User;
