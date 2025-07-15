import React, { useState } from 'react';
import { MapPin, Wifi, Car, Home, Users, DollarSign, Calendar, Phone, Mail, User, Search, Filter, Shirt, BookOpen, Trees, Building2, Shield, Droplets, Zap, Bus, Store, Building, MessageCircle, Heart, UserCheck } from 'lucide-react';
import './roommatecard.css';

const RoommateForm = ({ property, onContact, onSave, onRemove, isSaved }) => {
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    email: '',
    phone: '',
    university: '',
    yearOfStudy: '',
    gender: '',
    age: '',
    
    // Housing Preferences
    propertyType: '',
    budgetRange: '',
    preferredDistance: '',
    moveInDate: '',
    leaseDuration: '',
    roomType: '',
    amenities: [],
    smokingPreference: '',
    petsAllowed: '',
    studyEnvironment: '',
    socialLevel: '',
    additionalRequirements: ''
  });