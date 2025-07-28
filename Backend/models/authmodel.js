import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true, enum: ["admin", "student", "landlord"] },
    university: {
      type: String,
      required: function () {
        return this.role === "student"
      },
    },
    country: { type: String, required: true },
    password: { type: String, required: true },
    idType: { type: String, required: true },
    idDocumentUrl: { type: String, required: true },
    criminalRecordUrl: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
    approvalStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    rejectionReason: { type: String },

    // Add fields for password reset functionality
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    profile: {
 
    },
  },
  {
    timestamps: true, 
  },
)


userSchema.index({ email: 1 })
userSchema.index({ resetPasswordToken: 1 })

export default mongoose.model("User", userSchema)
