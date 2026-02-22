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
    const tasksRaw = await client.get('bazzar_tasks');
    const tasks = tasksRaw ? JSON.parse(tasksRaw) : [];
    return NextResponse.json(tasks);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await getClient();
    const tasksRaw = await client.get('bazzar_tasks');
    const tasks = tasksRaw ? JSON.parse(tasksRaw) : [];
    
    const newTask = {
      id: Date.now().toString(),
      label: body.label,
      status: body.status || 'Pending',
      date: new Date().toISOString(),
      comments: body.comments || []
    };
    
    tasks.push(newTask);
    await client.set('bazzar_tasks', JSON.stringify(tasks));
    return NextResponse.json(newTask);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const client = await getClient();
    const tasksRaw = await client.get('bazzar_tasks');
    let tasks = tasksRaw ? JSON.parse(tasksRaw) : [];
    
    tasks = tasks.map((task: any) => {
      if (task.id === body.id) {
        return { 
          ...task, 
          status: body.status !== undefined ? body.status : task.status,
          comments: body.comment ? [...(task.comments || []), body.comment] : (task.comments || [])
        };
      }
      return task;
    });
    
    await client.set('bazzar_tasks', JSON.stringify(tasks));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
