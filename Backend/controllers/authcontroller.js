const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Calling User model defined in models
const User = require('../models/authmodel.js')
