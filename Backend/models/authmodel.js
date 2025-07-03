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
      unique: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'landlord', 'admin'], 
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
      required: true 
    },
    idDocumentUrl: { 
      type: String, 
      required: true 
    },
    criminalRecordUrl: { 
      type: String,
       required: true
       },
  },
  { timestamps: true } 
);

const User = mongoose.model('User', userSchema);

export default User;
