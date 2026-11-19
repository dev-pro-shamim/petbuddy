import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';

export async function GET() {
  const orders = readData('orders.json', []);
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orders = readData<any[]>('orders.json', []);

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      customer: body.customer || 'Customer',
      email: body.email || '',
      items: body.items || 'Pet Buddy Bully Sticks',
      total: body.total || '$0.00 CAD',
      status: body.status || 'Pending'
    };

    orders.unshift(newOrder);
    writeData('orders.json', orders);

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to record order' }, { status: 500 });
  }
}
