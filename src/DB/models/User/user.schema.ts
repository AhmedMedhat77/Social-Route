import { Schema } from "mongoose";
import { GENDER_ENUM, AGENT_ENUM, ROLE_ENUM } from "../../../utils/common/enum";
import { IUser } from "../../../utils/common/interfaces/User";

export const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
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
      default: GENDER_ENUM.MALE,
    },
    credentialsUpdatedAt: {
      type: Date,
      default: undefined,
    },
    password: {
      type: String,
      required: function (this: IUser) {
        return this.userAgent === AGENT_ENUM.local;
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    userAgent: {
      type: String,
      enum: AGENT_ENUM,
      default: AGENT_ENUM.local,
    },
    otp: {
      type: String,
      trim: true,
    },
    otpExpiresAt: {
      type: Date,
      default: undefined,
    },
    otpAttempts: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ROLE_ENUM,
      default: ROLE_ENUM.USER,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

userSchema
  .virtual("fullname")
  .get(function (this: IUser) {
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function (value: string) {
    const [fName, lName] = value.split(" ");
    this.firstName = fName;
    this.lastName = lName;
  });

userSchema.virtual("age").get(function (this: IUser) {
  if (this.dob) {
    const ageDiff = Date.now() - this.dob.getTime();
    return Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
  }
});

userSchema.pre("validate", function (next) {
  if (this.userAgent === AGENT_ENUM.local && !this.email && !this.phone) {
    this.invalidate("email", "Either email or phone is required for local signups.");
    this.invalidate("phone", "Either phone or email is required for local signups.");
  }
  next();
});
