import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

let messages: any[] = [];

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !verifyToken(authHeader.split(' ')[1])) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newMessage = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date(),
      status: 'unread',
    };
    messages.unshift(newMessage);
    return NextResponse.json({ success: true, message: newMessage }, { status: 201 });
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !verifyToken(authHeader.split(' ')[1])) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { id, status } = await request.json();
    const messageIndex = messages.findIndex(m => m.id === id);
    
    if (messageIndex !== -1) {
      messages[messageIndex].status = status;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}