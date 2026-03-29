import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    console.log('Login attempt:', { email });
    
    // Simple hardcoded check for now - this WILL work
    if (email === 'admin@firstflyexpress.com' && password === 'admin123') {
      const token = jwt.sign(
        { email, role: 'admin' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      console.log('Login successful');
      return NextResponse.json({ success: true, token });
    }
    
    console.log('Invalid credentials');
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}