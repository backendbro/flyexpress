import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const awb = searchParams.get('awb');
  
  if (!awb) {
    return NextResponse.json({ error: 'AWB number required' }, { status: 400 });
  }
  
  const supabase = await createClient();
  
  // Fetch shipment from Supabase
  const { data: shipment, error } = await supabase
    .from('shipments')
    .select(`
      *,
      tracking_updates (*)
    `)
    .eq('awb', awb)
    .single();
  
  if (error || !shipment) {
    return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
  }
  
  // Format the response to match your existing structure
  const formattedShipment = {
    id: shipment.id,
    awb: shipment.awb,
    status: shipment.status,
    lastUpdate: shipment.updated_at,
    updates: shipment.tracking_updates.map((update: any) => ({
      status: update.status,
      location: update.location,
      notes: update.notes,
      timestamp: update.timestamp,
      completed: update.completed
    })),
    createdAt: shipment.created_at,
    sender: shipment.sender,
    receiver: shipment.receiver,
    origin: shipment.origin,
    destination: shipment.destination,
    weight: shipment.weight,
    content: shipment.content
  };
  
  return NextResponse.json(formattedShipment);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { awb, status, location, notes } = body;
    
    const supabase = await createClient();
    
    // Get the shipment
    const { data: shipment, error: findError } = await supabase
      .from('shipments')
      .select('id')
      .eq('awb', awb)
      .single();
    
    if (findError || !shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }
    
    // Update shipment status
    const { error: updateError } = await supabase
      .from('shipments')
      .update({ status, updated_at: new Date() })
      .eq('awb', awb);
    
    if (updateError) throw updateError;
    
    // Add tracking update
    const { error: trackingError } = await supabase
      .from('tracking_updates')
      .insert({
        shipment_id: shipment.id,
        status,
        location,
        notes: notes || null,
        completed: true,
        timestamp: new Date()
      });
    
    if (trackingError) throw trackingError;
    
    // Fetch updated shipment with all updates
    const { data: updatedShipment, error: fetchError } = await supabase
      .from('shipments')
      .select(`
        *,
        tracking_updates (*)
      `)
      .eq('awb', awb)
      .single();
    
    if (fetchError) throw fetchError;
    
    return NextResponse.json(updatedShipment);
  } catch (error) {
    console.error('Error updating tracking:', error);
    return NextResponse.json({ error: 'Failed to update tracking' }, { status: 500 });
  }
}