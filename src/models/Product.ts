import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    description: { 
      type: String, 
      required: [true, 'Please provide a description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    price: { 
      type: Number, 
      required: [true, 'Please provide a price'],
      min: [0, 'Price must be a positive number']
    },
    category: { 
      type: String, 
      required: [true, 'Please provide a category'],
      enum: ['Electronics', 'Computing', 'Mobile', 'Accessories', 'Books', 'Other']
    },
    stock: { 
      type: Number, 
      required: [true, 'Please provide stock quantity'],
      default: 0,
      min: [0, 'Stock cannot be negative']
    }
  },
  { 
    timestamps: true 
  }
);

// Add unique index for name within Category (example validation)
ProductSchema.index({ name: 1, category: 1 });

export const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
