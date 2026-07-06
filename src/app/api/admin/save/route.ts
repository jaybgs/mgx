import { NextResponse } from 'next/server';
import { initDb, upsertSetting } from '../../../../lib/db';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { id, recipient, price } = data;

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    await initDb();
    const success = await upsertSetting('mdx_blog', id, recipient, price);

    if (success) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Database operation failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
