import { createClient } from 'redis';
import { NextResponse } from 'next/server';

const REDIS_URL = process.env.KV_REDIS_URL || 'redis://default:iNAICmqYn5hFkbfhkTdS8LsDPM73auO0@redis-19875.c100.us-east-1-4.ec2.cloud.redislabs.com:19875';

async function getClient() {
  const client = createClient({ url: REDIS_URL });
  client.on('error', (err) => console.log('Redis Client Error', err));
  if (!client.isOpen) await client.connect();
  return client;
}

export async function GET() {
  try {
    const client = await getClient();
    const invRaw = await client.get('bazzar_inventory');
    const inventory = invRaw ? JSON.parse(invRaw) : [
      { id: '1', name: 'FaceApp Pro', price: '350₽', type: 'Sub', status: 'Active' },
      { id: '2', name: 'Minecraft (iOS)', price: '1000₽', type: 'Game', status: 'Active' },
      { id: '3', name: 'Mafia Trilogy', price: '1190₽', type: 'PS4/5', status: 'Draft' },
      { id: '4', name: 'It Takes Two', price: '690₽', type: 'PS4/5', status: 'Draft' },
    ];
    return NextResponse.json(inventory);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await getClient();
    const invRaw = await client.get('bazzar_inventory');
    const inventory = invRaw ? JSON.parse(invRaw) : [];
    
    const newItem = {
      id: Date.now().toString(),
      ...body
    };
    
    inventory.push(newItem);
    await client.set('bazzar_inventory', JSON.stringify(inventory));
    return NextResponse.json(newItem);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
