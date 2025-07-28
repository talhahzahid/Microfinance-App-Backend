import mongoose from "mongoose";

// Guardian Schema
const guardianSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  relation: {
    type: String,
    enum: ["Father", "Mother", "Brother", "Sister", "Spouse", "Other"],
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  cnic: {
    type: String,
    required: true,
  },
  Dob: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

// Main Loan Form Schema
const LoanFormSchema = new mongoose.Schema(
  {
    applicantInfo: {
      fullName: { type: String, required: true, minlength: 3, maxlength: 50 },
      fatherName: { type: String, required: true, minlength: 3, maxlength: 50 },
      cnic: {
        type: String,
        required: true,
        unique: true,
      },
      dateOfBirth: { type: Date, required: true },
      gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      phone: { type: String, required: true },
      address: { type: String, required: true, maxlength: 200 },
      city: { type: String, required: true },
    },
    loanDetails: {
      loanType: {
        type: String,
        required: true,
      },
      loanPurpose: { type: String, required: true },
      loanAmount: { type: Number, required: true },
      durationMonths: { type: Number, required: true },
      minDeposit: { type: Number, required: true },
      monthlyInstalment: {
        type: String,
        required: true,
      },
    },
    guardians: {
      type: [guardianSchema],
      validate: [arrayLimit, "Exactly 2 guardians are required"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Custom validator to ensure exactly 2 guardians
function arrayLimit(val) {
  return val.length === 2;
}

export default mongoose.model("LoanForm", LoanFormSchema);
