import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  // Basic property information
  houseName: {
    type: String,
    required: [true, 'House name is required'],
    trim: true,
    maxlength: [100, 'House name cannot exceed 100 characters']
  },
  
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [50, 'Location cannot exceed 50 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Pricing
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Price cannot be negative']
  },
  
  pricePerPerson: {
    type: Number,
    // This will be calculated automatically
  },
  
  // Capacity and occupancy
  availableBeds: {
    type: Number,
    required: [true, 'Number of available beds is required'],
    min: [1, 'Must have at least 1 bed'],
    max: [20, 'Cannot exceed 20 beds']
  },
  
  currentRoommates: {
    type: Number,
    default: 0,
    min: [0, 'Current roommates cannot be negative']
  },
  
  // Amenities - flexible array for all amenities including WiFi, Furnished, etc.
  amenities: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    icon: {
      type: String, // For storing icon names (like 'wifi', 'parking', etc.)
      required: true
    },
    available: {
      type: Boolean,
      default: true
    }
  }],
  
  // Images
  mainImage: {
    type: String,
    required: [true, 'Main image is required']
  },
  
  otherImages: [{
    type: String
  }],
  
  // Location coordinates for map
  coordinates: {
    type: [Number], // [latitude, longitude]
    required: [true, 'Coordinates are required'],
    validate: {
      validator: function(v) {
        return v.length === 2 && 
               v[0] >= -90 && v[0] <= 90 && // latitude
               v[1] >= -180 && v[1] <= 180; // longitude
      },
      message: 'Coordinates must be [latitude, longitude] with valid ranges'
    }
  },
  
  // Owner information
  owner: {
    name: {
      type: String,
      required: [true, 'Owner name is required'],
      trim: true,
      maxlength: [100, 'Owner name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Owner email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Owner phone is required'],
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner user ID is required']
    }
  },
  
  // Property status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Remove approval system - properties go live immediately
  
  // Remove deprecated fields - everything is now in amenities array
  
  // Property rules
  rules: [{
    type: String,
    trim: true
  }],
  
  // Contact preferences
  contactPreference: {
    type: String,
    enum: ['phone', 'email', 'both'],
    default: 'both'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Pre-save middleware to calculate pricePerPerson
propertySchema.pre('save', function(next) {
  if (this.totalPrice && this.availableBeds) {
    this.pricePerPerson = Math.round(this.totalPrice / this.availableBeds);
  }
  next();
});

// Pre-update middleware to recalculate pricePerPerson
propertySchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.totalPrice || update.availableBeds) {
    const totalPrice = update.totalPrice || this.totalPrice;
    const availableBeds = update.availableBeds || this.availableBeds;
    if (totalPrice && availableBeds) {
      update.pricePerPerson = Math.round(totalPrice / availableBeds);
    }
  }
  next();
});

// Indexes for better query performance
propertySchema.index({ location: 1 });
propertySchema.index({ totalPrice: 1 });
propertySchema.index({ pricePerPerson: 1 });
propertySchema.index({ isActive: 1 });
propertySchema.index({ 'owner.userId': 1 });
propertySchema.index({ createdAt: -1 });
propertySchema.index({ 'amenities.name': 1 });

// Virtual for available spots
propertySchema.virtual('availableSpots').get(function() {
  return Math.max(0, this.availableBeds - this.currentRoommates);
});

// Virtual for occupancy rate
propertySchema.virtual('occupancyRate').get(function() {
  return this.availableBeds > 0 ? 
    Math.round((this.currentRoommates / this.availableBeds) * 100) : 0;
});

// Ensure virtual fields are serialized
propertySchema.set('toJSON', { virtuals: true });
propertySchema.set('toObject', { virtuals: true });

const Property = mongoose.model('Property', propertySchema);

export default Property;