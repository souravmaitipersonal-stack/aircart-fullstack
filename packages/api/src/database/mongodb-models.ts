/**
 * MongoDB User Model & Schema
 * Phase 2: User Authentication with MongoDB Document Store
 * Compatible with Mongoose ORM
 */

import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../models/User';

export interface IUserDocument extends User, Document {
  _id: mongoose.Types.ObjectId;
}

// User schema for MongoDB
const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // Don't return password by default
    },
    name: {
      type: String,
      required: true,
      maxlength: 255,
    },
    phone: {
      type: String,
      maxlength: 20,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
    },
    updatedAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// Update updatedAt before saving
userSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Update updatedAt on findByIdAndUpdate (deprecated approach but included for compatibility)
userSchema.pre('findByIdAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

// Create indexes
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Prevent password from being returned in queries by default
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UserModel = mongoose.model<IUserDocument>('User', userSchema);

/**
 * Password reset token schema for MongoDB
 */
const passwordResetSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tokenHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    usedAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    collection: 'password_reset_tokens',
  }
);

passwordResetSchema.index({ userId: 1 });
passwordResetSchema.index({ expiresAt: 1 });

export const PasswordResetTokenModel = mongoose.model('PasswordResetToken', passwordResetSchema);

/**
 * User audit log schema
 */
const auditLogSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    action: {
      type: String,
      required: true,
    },
    details: {
      type: Schema.Types.Mixed,
    },
    ipAddress: String,
    userAgent: String,
    createdAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    collection: 'audit_logs',
  }
);

auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ createdAt: -1 });

export const AuditLogModel = mongoose.model('AuditLog', auditLogSchema);
