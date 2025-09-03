import { model, Schema } from "mongoose";
import { GENDER_ENUM, PLATFORM_ENUM } from "../../types";

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dob?: Date;
  gender?: GENDER_ENUM;
  password?: string;
  isVerified: boolean;
  isDeleted: boolean;
  platform: PLATFORM_ENUM;
  fullName?: string;
  age?: number;
  avatar?: string;
  otp?: string;
  otpExpiresAt?: Date;
  otpAttempts: number;
  credentialsUpdatedAt: Date;
}

const schema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    fullName: {
      type: String,
      virtual: true,
      get: function (this: IUser) {
        return `${this.firstName} ${this.lastName}`;
      },
    },
    age: {
      type: Number,
      virtual: true,
      get: function (this: IUser) {
        if (this.dob) {
          const ageDiff = Date.now() - this.dob.getTime();
          return Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
        }
      },
    },
    avatar: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: GENDER_ENUM,
    },
    credentialsUpdatedAt: {
      type: Date,
      default: undefined,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    platform: {
      type: String,
      enum: PLATFORM_ENUM,
      default: PLATFORM_ENUM.local,
    },
    otp: {
      type: String,
      trim: true,
    },
    otpExpiresAt: {
      type: Date,
    },
    otpAttempts: {
      type: Number,
      default: 0,
      
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

schema.pre("validate", function (next) {
  if (this.platform === "local" && !this.email && !this.phone) {
    this.invalidate("email", "Either email or phone is required for local signups.");
    this.invalidate("phone", "Either phone or email is required for local signups.");
  }
  next();
});

const User = model<IUser>("User", schema);

export default User;
