import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';

export async function GET() {
  const cms = readData('cms.json', {});
  return NextResponse.json(cms);
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const current = readData('cms.json', {});
    const updated = {
      ...current,
      ...body
    };
    writeData('cms.json', updated);
    return NextResponse.json({ success: true, cms: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update CMS' }, { status: 500 });
  }
}
