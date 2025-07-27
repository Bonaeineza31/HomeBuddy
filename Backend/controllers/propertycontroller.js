import Property from '../models/Property.js';
import mongoose from 'mongoose';

// @desc    Get all active and approved properties
// @route   GET /api/properties
// @access  Public
export const getAllProperties = async (req, res) => {
  try {
    const {
      location,
      minPrice,
      maxPrice,
      amenities, // Filter by specific amenities
      minBeds,
      maxBeds,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {
      isActive: true
      // Removed isApproved - properties go live immediately
    };

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.pricePerPerson = {};
      if (minPrice) filter.pricePerPerson.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerPerson.$lte = Number(maxPrice);
    }

    // Filter by amenities
    if (amenities) {
      const amenityList = Array.isArray(amenities) ? amenities : [amenities];
      filter['amenities.name'] = { $in: amenityList };
    }

    if (minBeds || maxBeds) {
      filter.availableBeds = {};
      if (minBeds) filter.availableBeds.$gte = Number(minBeds);
      if (maxBeds) filter.availableBeds.$lte = Number(maxBeds);
    }

    // Sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const properties = await Property.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-owner.userId') // Hide sensitive owner data from public
      .exec();

    // Get total count for pagination
    const total = await Property.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      },
      data: properties
    });
  } catch (error) {
    console.error('Error in getAllProperties:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching properties',
      error: error.message
    });
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID'
      });
    }

    const property = await Property.findById(id)
      .select('-owner.userId') // Hide sensitive owner data
      .exec();

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (!property.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Property not available'
      });
    }

    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Error in getPropertyById:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching property',
      error: error.message
    });
  }
};

// @desc    Create new property (Landlord/Admin only)
// @route   POST /api/properties
// @access  Private
export const createProperty = async (req, res) => {
  try {
    const {
      houseName,
      location,
      description,
      totalPrice,
      availableBeds,
      currentRoommates = 0,
      amenities = [], // All amenities including WiFi, Furnished, etc.
      mainImage,
      otherImages = [],
      coordinates,
      owner,
      rules = [],
      contactPreference = 'both'
    } = req.body;

    // Validate required fields
    if (!houseName || !location || !description || !totalPrice || !availableBeds || !mainImage || !coordinates || !owner) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate owner information
    if (!owner.name || !owner.email || !owner.phone || !owner.userId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete owner information'
      });
    }

    // Validate coordinates
    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Coordinates must be an array of [latitude, longitude]'
      });
    }

    // Validate current roommates doesn't exceed available beds
    if (currentRoommates > availableBeds) {
      return res.status(400).json({
        success: false,
        message: 'Current roommates cannot exceed available beds'
      });
    }

    const property = await Property.create({
      houseName,
      location,
      description,
      totalPrice,
      availableBeds,
      currentRoommates,
      amenities,
      mainImage,
      otherImages,
      coordinates,
      owner,
      rules,
      contactPreference
    });

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property
    });
  } catch (error) {
    console.error('Error in createProperty:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating property',
      error: error.message
    });
  }
};

// @desc    Update property (Owner/Admin only)
// @route   PUT /api/properties/:id
// @access  Private
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID'
      });
    }

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if user is owner or admin (you'll need to implement auth middleware)
    // if (req.user.role !== 'admin' && property.owner.userId.toString() !== req.user.id) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Not authorized to update this property'
    //   });
    // }

    // Validate current roommates doesn't exceed available beds if updating
    if (req.body.currentRoommates && req.body.availableBeds) {
      if (req.body.currentRoommates > req.body.availableBeds) {
        return res.status(400).json({
          success: false,
          message: 'Current roommates cannot exceed available beds'
        });
      }
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: updatedProperty
    });
  } catch (error) {
    console.error('Error in updateProperty:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating property',
      error: error.message
    });
  }
};

// @desc    Delete property (Owner/Admin only)
// @route   DELETE /api/properties/:id
// @access  Private
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID'
      });
    }

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if user is owner or admin (you'll need to implement auth middleware)
    // if (req.user.role !== 'admin' && property.owner.userId.toString() !== req.user.id) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Not authorized to delete this property'
    //   });
    // }

    await Property.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteProperty:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting property',
      error: error.message
    });
  }
};

// @desc    Toggle property active status
// @route   PATCH /api/properties/:id/toggle-status
// @access  Private
export const togglePropertyStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID'
      });
    }

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    property.isActive = !property.isActive;
    await property.save();

    res.status(200).json({
      success: true,
      message: `Property ${property.isActive ? 'activated' : 'deactivated'} successfully`,
      data: property
    });
  } catch (error) {
    console.error('Error in togglePropertyStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling property status',
      error: error.message
    });
  }
};

// @desc    Get properties by owner (Owner/Admin only)
// @route   GET /api/properties/owner/:userId
// @access  Private
export const getPropertiesByOwner = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    const properties = await Property.find({ 'owner.userId': userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Property.countDocuments({ 'owner.userId': userId });

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      },
      data: properties
    });
  } catch (error) {
    console.error('Error in getPropertiesByOwner:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching owner properties',
      error: error.message
    });
  }
};

// @desc    Get properties with amenity filtering
// @route   GET /api/properties/filter-amenities
// @access  Public
export const getPropertiesByAmenities = async (req, res) => {
  try {
    const { amenities, page = 1, limit = 10 } = req.query;
    
    let filter = { isActive: true };
    
    if (amenities) {
      const amenityList = Array.isArray(amenities) ? amenities : [amenities];
      filter['amenities.name'] = { $in: amenityList };
    }
    
    const properties = await Property.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-owner.userId')
      .exec();
    
    const total = await Property.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      },
      data: properties
    });
  } catch (error) {
    console.error('Error in getPropertiesByAmenities:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while filtering properties by amenities',
      error: error.message
    });
  }
};

// Remove the approve property function since we don't need approval anymore