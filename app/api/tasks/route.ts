import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  const tasks = await kv.get('bazzar_tasks') || [];
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();
  const tasks: any[] = await kv.get('bazzar_tasks') || [];
  
  const newTask = {
    id: Date.now().toString(),
    label: body.label,
    status: body.status || 'Pending',
    date: new Date().toISOString(),
  };
  
  tasks.push(newTask);
  await kv.set('bazzar_tasks', tasks);
  
  return NextResponse.json(newTask);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  let tasks: any[] = await kv.get('bazzar_tasks') || [];
  
  tasks = tasks.map(task => 
    task.id === body.id ? { ...task, status: body.status } : task
  );
  
  await kv.set('bazzar_tasks', tasks);
  return NextResponse.json({ success: true });
}
