import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';

export async function GET() {
  const products = readData('products.json', []);
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const products = readData<any[]>('products.json', []);

    const maxId = products.reduce((acc, p) => Math.max(acc, Number(p.id) || 0), 0);
    const newProduct = {
      id: maxId + 1,
      name: body.name || 'New Pet Buddy Product',
      category: body.category || 'bully-sticks',
      length: body.length || '6-Inch',
      badge: body.badge || 'New Arrival',
      price: parseFloat(body.price) || 29.99,
      salePrice: body.salePrice ? parseFloat(body.salePrice) : null,
      rating: 5.0,
      reviews: 1,
      image: body.image || '/assets/images/products/pet-buddy-6in-6pk-cross.jpg',
      description: body.description || '',
      ingredients: body.ingredients || '100% Pure Natural Grass-Fed Beef Pizzle',
      amazonUrl: body.amazonUrl || 'https://www.amazon.ca/dp/B0H637LFT4/?th=1',
      inStock: body.inStock !== false,
      featured: Boolean(body.featured)
    };

    products.unshift(newProduct);
    writeData('products.json', products);

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
