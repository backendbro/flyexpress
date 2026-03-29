import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage (replace with database in production)
let shipments: any[] = [];

// Helper function to generate initial tracking updates
function generateInitialTrackingUpdates(awb: string, origin: string, destination: string) {
  const now = new Date();
  return [
    {
      status: 'Booking Confirmed',
      location: origin,
      timestamp: now,
      completed: true,
      notes: `Shipment booked with AWB: ${awb}`
    },
    {
      status: 'In Transit',
      location: 'Sorting Center',
      timestamp: new Date(now.getTime() + 2 * 60 * 60 * 1000),
      completed: false,
      notes: 'Shipment received at sorting facility'
    },
    {
      status: 'Arrived at Destination Hub',
      location: destination,
      timestamp: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      completed: false,
      notes: 'Expected arrival at destination hub'
    }
  ];
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !verifyToken(authHeader.split(' ')[1])) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return NextResponse.json(shipments);
}

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !verifyToken(authHeader.split(' ')[1])) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { awb, sender, receiver, origin, destination, weight, content } = body;
    
    // Check if shipment with same AWB already exists
    const existingShipment = shipments.find(s => s.awb === awb);
    if (existingShipment) {
      return NextResponse.json({ error: 'Shipment with this AWB already exists' }, { status: 400 });
    }
    
    // Create new shipment
    const newShipment = {
      id: uuidv4(),
      awb: awb,
      sender: sender,
      receiver: receiver,
      origin: origin,
      destination: destination,
      weight: parseFloat(weight),
      content: content,
      status: 'Booking Confirmed',
      createdAt: new Date(),
      lastUpdate: new Date(),
      updates: generateInitialTrackingUpdates(awb, origin, destination)
    };
    
    shipments.unshift(newShipment);
    
    return NextResponse.json({ success: true, shipment: newShipment }, { status: 201 });
  } catch (error) {
    console.error('Error creating shipment:', error);
    return NextResponse.json({ error: 'Failed to create shipment' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !verifyToken(authHeader.split(' ')[1])) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { awb, updates } = await request.json();
    const shipmentIndex = shipments.findIndex(s => s.awb === awb);
    
    if (shipmentIndex === -1) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }
    
    shipments[shipmentIndex].updates = updates;
    shipments[shipmentIndex].status = updates[0]?.status || shipments[shipmentIndex].status;
    shipments[shipmentIndex].lastUpdate = new Date();
    
    return NextResponse.json({ success: true, shipment: shipments[shipmentIndex] });
  } catch (error) {
    console.error('Error updating shipment:', error);
    return NextResponse.json({ error: 'Failed to update shipment' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !verifyToken(authHeader.split(' ')[1])) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const awb = searchParams.get('awb');
    
    if (!awb) {
      return NextResponse.json({ error: 'AWB number required' }, { status: 400 });
    }
    
    const shipmentIndex = shipments.findIndex(s => s.awb === awb);
    
    if (shipmentIndex === -1) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }
    
    shipments.splice(shipmentIndex, 1);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting shipment:', error);
    return NextResponse.json({ error: 'Failed to delete shipment' }, { status: 500 });
  }
}