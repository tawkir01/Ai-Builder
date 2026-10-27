import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Product } from '@/models/Product';

/**
 * GET /api/products
 * Fetch all products from the database
 */
export async function GET(req: Request) {
  try {
    await dbConnect();
    
    // Parse query parameters if needed
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    
    const query = category ? { category } : {};
    const products = await Product.find(query).sort({ createdAt: -1 });

    console.log(`[API] Fetched ${products.length} products`);
    
    return NextResponse.json({ 
      success: true, 
      count: products.length, 
      data: products 
    });
  } catch (error: any) {
    console.error('[API Error] GET /api/products:', error.message);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch products' 
    }, { status: 500 });
  }
}

/**
 * POST /api/products
 * Create a new product in the database
 */
export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const body = await req.json();
    
    // Basic structural validation - Mongoose will handle schema validation
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No content provided' 
      }, { status: 400 });
    }

    const product = await Product.create(body);
    
    console.log(`[API] Created new product: ${product.name} (UUID: ${product._id})`);

    return NextResponse.json({ 
      success: true, 
      data: product 
    }, { status: 201 });
  } catch (error: any) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return NextResponse.json({ 
        success: false, 
        error: messages.join(', ') 
      }, { status: 400 });
    }
    
    console.error('[API Error] POST /api/products:', error.message);
    return NextResponse.json({ 
      success: false, 
      error: 'Server error while creating product' 
    }, { status: 500 });
  }
}
