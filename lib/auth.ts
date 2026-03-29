import jwt from 'jsonwebtoken';

export function verifyToken(token: string) {
  if (!token) {
    console.log('No token provided');
    return null;
  }
  
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    );
    console.log('Token verified successfully');
    return decoded;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Token verification failed:', error.message);
    } else {
      console.error('Token verification failed:', error);
    }
    return null;
  }
}

export function generateToken(payload: any) {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'your-secret-key',
    {
      expiresIn: '24h',
    }
  );
}