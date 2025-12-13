import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function POST(req: Request){
  try {
    const { messages } = await req.json();
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'Missing OPENROUTER_API_KEY' }, { status: 400 });
    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'openrouter/auto', messages, temperature: 0.3 })
    });
    if (!resp.ok) return NextResponse.json({ error: 'Upstream error', detail: await resp.text() }, { status: 502 });
    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content ?? '';
    return NextResponse.json({ content });
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || 'AI error' }, { status: 500 });
  }
}
