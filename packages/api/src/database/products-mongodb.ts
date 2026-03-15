// @ts-nocheck
/**
 * MongoDB Models for Products, Reviews, and Shopping Cart
 * Phase 3: Product Management with MongoDB
 * Mongoose ORM for document-based storage
 */

import mongoose, { Schema, Document } from 'mongoose';

// Product document interface
export interface IProductDocument extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  category: string;
  subcategory?: string;
  images: string[];
  rating: number;
  reviewCount: number;
  tags: string[];
  sku: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  isActive: boolean;
  isFeatured: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Product schema
const productSchema = new Schema<IProductDocument>(
  {
    name: {
      type: String,
      required: true,
      maxlength: 255,
      index: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    subcategory: String,
    images: {
      type: [String],
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    tags: [String],
    sku: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
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
    collection: 'products',
  }
);

// Text indexes for search
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ rating: -1 });

// Update timestamps
productSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

productSchema.pre('findByIdAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

export const ProductModel = mongoose.model<IProductDocument>('Product', productSchema);

// ============================================
// REVIEW SCHEMA
// ============================================

export interface IReviewDocument extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  verified: boolean;
  helpfulCount: number;
  unhelpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReviewDocument>(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: String,
    content: String,
    images: [String],
    verified: {
      type: Boolean,
      default: false,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    unhelpfulCount: {
      type: Number,
      default: 0,
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
    collection: 'reviews',
  }
);

reviewSchema.index({ productId: 1, rating: 1 });
reviewSchema.index({ userId: 1, createdAt: -1 });

export const ReviewModel = mongoose.model<IReviewDocument>('Review', reviewSchema);

// ============================================
// SHOPPING CART SCHEMA
// ============================================

export interface ICartItemDocument {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  addedAt: Date;
}

export interface ICartDocument extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItemDocument[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItemDocument>({
  productId: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  addedAt: {
    type: Date,
    default: () => new Date(),
  },
});

const cartSchema = new Schema<ICartDocument>(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    items: [cartItemSchema],
    subtotal: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
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
    collection: 'shopping_carts',
  }
);

cartSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  
  // Recalculate totals
  this.subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  this.tax = Math.round(this.subtotal * 0.1 * 100) / 100; // 10% tax
  this.total = this.subtotal + this.tax;
  
  next();
});

export const CartModel = mongoose.model<ICartDocument>('Cart', cartSchema);

// ============================================
// CATEGORY SCHEMA
// ============================================

export interface ICategoryDocument extends Document {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  displayOrder?: number;
  createdAt: Date;
}

const categorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: String,
    imageUrl: String,
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    displayOrder: Number,
    createdAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    collection: 'categories',
  }
);

categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1, displayOrder: 1 });

export const CategoryModel = mongoose.model<ICategoryDocument>('Category', categorySchema);
