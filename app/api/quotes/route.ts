import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';

export async function GET() {
  const quotes = readData('quotes.json', []);
  return NextResponse.json(quotes);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const quotes = readData<any[]>('quotes.json', []);

    const newQuote = {
      id: `RFQ-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      name: body.name || 'Store Buyer',
      business: body.business || 'Retail Store',
      businessType: body.businessType || 'Pet Specialty Store',
      email: body.email || '',
      phone: body.phone || '',
      product: body.product || 'Pet Buddy Bully Sticks (6-Inch)',
      volume: body.volume || '50 - 100 Packs',
      location: body.location || 'Canada',
      message: body.message || '',
      status: 'New'
    };

    quotes.unshift(newQuote);
    writeData('quotes.json', quotes);

    return NextResponse.json({ success: true, quote: newQuote }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit quote' }, { status: 500 });
  }
}
