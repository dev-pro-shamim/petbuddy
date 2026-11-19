import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const products = readData<any[]>('products.json', []);
  const product = products.find(p => String(p.id) === params.id);
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const products = readData<any[]>('products.json', []);
    const index = products.findIndex(p => String(p.id) === params.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    products[index] = {
      ...products[index],
      ...body,
      id: Number(params.id),
      price: body.price !== undefined ? parseFloat(body.price) : products[index].price,
      salePrice: body.salePrice ? parseFloat(body.salePrice) : null,
      inStock: body.inStock !== undefined ? Boolean(body.inStock) : products[index].inStock,
    };

    writeData('products.json', products);
    return NextResponse.json({ success: true, product: products[index] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    let products = readData<any[]>('products.json', []);
    const exists = products.some(p => String(p.id) === params.id);

    if (!exists) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    products = products.filter(p => String(p.id) !== params.id);
    writeData('products.json', products);

    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 });
  }
}
