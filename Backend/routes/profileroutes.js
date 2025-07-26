const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/profileController");
const auth = require("../middleware/auth"); // should verify JWT and set req.user

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

module.exports = router;
