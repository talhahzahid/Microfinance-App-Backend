import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  cnic: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return;
  const hassedPassword = await bcrypt.hash(user.password, 10);
  user.password = hassedPassword;
  next();
});

export default mongoose.model("User", userSchema);
