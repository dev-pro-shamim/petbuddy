import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const quotes = readData<any[]>('quotes.json', []);
    const index = quotes.findIndex(q => q.id === params.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    quotes[index] = {
      ...quotes[index],
      ...body
    };

    writeData('quotes.json', quotes);
    return NextResponse.json({ success: true, quote: quotes[index] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update quote' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    let quotes = readData<any[]>('quotes.json', []);
    quotes = quotes.filter(q => q.id !== params.id);
    writeData('quotes.json', quotes);
    return NextResponse.json({ success: true, message: 'Quote deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete quote' }, { status: 500 });
  }
}
