import { createClient } from 'redis';
import { NextResponse } from 'next/server';

const REDIS_URL = process.env.KV_REDIS_URL || 'redis://default:iNAICmqYn5hFkbfhkTdS8LsDPM73auO0@redis-19875.c100.us-east-1-4.ec2.cloud.redislabs.com:19875';

async function getClient() {
  const client = createClient({ url: REDIS_URL });
  if (!client.isOpen) await client.connect();
  return client;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id') || 'jarvis';
  
  try {
    const client = await getClient();
    const screenshot = await client.get(`agent_screen:${id}`);
    return NextResponse.json({ screenshot });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await getClient();
    await client.set(`agent_screen:${body.id}`, body.screenshot);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
