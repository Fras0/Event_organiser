const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Username is missing"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is missing"],
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
    },

    password: {
      type: String,
      required: [true, "Password is missing"],
      minLength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "volunteer", "user"],
      required: true,
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    fcmToken: {
      type: String,
      select: false,
    },
    emailVerificationToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
