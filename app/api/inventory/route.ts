import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  const inventory = await kv.get('bazzar_inventory') || [
    { id: '1', name: 'FaceApp Pro', price: '350₽', type: 'Sub', status: 'Active' },
    { id: '2', name: 'Minecraft (iOS)', price: '1000₽', type: 'Game', status: 'Active' },
    { id: '3', name: 'Mafia Trilogy', price: '1190₽', type: 'PS4/5', status: 'Draft' },
    { id: '4', name: 'It Takes Two', price: '690₽', type: 'PS4/5', status: 'Draft' },
  ];
  return NextResponse.json(inventory);
}

export async function POST(request: Request) {
  const body = await request.json();
  const inventory: any[] = await kv.get('bazzar_inventory') || [];
  
  const newItem = {
    id: Date.now().toString(),
    ...body
  };
  
  inventory.push(newItem);
  await kv.set('bazzar_inventory', inventory);
  
  return NextResponse.json(newItem);
}
