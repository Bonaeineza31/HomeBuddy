import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: {
   type: String, 
   required: true
  },
  description:{ 
    type: String, 
    required: true
  },
  price: { 
    type: Number, 
    required: true
  },
  location: {
    address: String,
    coordinates: { type: [Number], index: '2dsphere' }
  },
  amenities: [String],
  images: [String],
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  universityNearby: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'University' },
  isApproved: {
     type: Boolean, 
     default: false },
  createdAt: { 
    type: Date, 
    default: Date.now }
});

const Property = mongoose.model('Property', propertySchema);

export default Property;
