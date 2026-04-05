import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { getTokenFromRequest } from '@/lib/auth';


export async function GET(req: NextRequest) {
  // const authHeader = request.headers.get('authorization')
  // if (!authHeader || !verifyToken(authHeader.split(' ')[1])) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // }

  const decoded = getTokenFromRequest(req);

  if (!decoded) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const supabase = await createClient()
  
  const { data: shipments, error } = await supabase
    .from('shipments')
    .select(`
      *,
      tracking_updates (*)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(shipments)
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !verifyToken(authHeader.split(' ')[1])) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { awb, sender, receiver, origin, destination, weight, content } = body

    const supabase = await createClient()

    // Check if AWB exists
    const { data: existing } = await supabase
      .from('shipments')
      .select('awb')
      .eq('awb', awb)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'AWB already exists' }, { status: 400 })
    }

    // Create shipment
    const { data: shipment, error: shipmentError } = await supabase
      .from('shipments')
      .insert({
        awb, sender, receiver, origin, destination, 
        weight: parseFloat(weight), content
      })
      .select()
      .single()

    if (shipmentError) throw shipmentError

    // Create initial tracking update
    const { error: updateError } = await supabase
      .from('tracking_updates')
      .insert({
        shipment_id: shipment.id,
        status: 'Booking Confirmed',
        location: origin,
        completed: true,
        notes: `Shipment booked with AWB: ${awb}`
      })

    if (updateError) throw updateError

    return NextResponse.json({ success: true, shipment }, { status: 201 })
  } catch (error) {
    console.error('Error creating shipment:', error)
    return NextResponse.json({ error: 'Failed to create shipment' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !verifyToken(authHeader.split(' ')[1])) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { awb, status, location, notes } = await request.json()
    const supabase = await createClient()

    // Get shipment
    const { data: shipment, error: findError } = await supabase
      .from('shipments')
      .select('id')
      .eq('awb', awb)
      .single()

    if (findError || !shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })
    }

    // Update shipment status
    const { error: updateError } = await supabase
      .from('shipments')
      .update({ status, updated_at: new Date() })
      .eq('awb', awb)

    if (updateError) throw updateError

    // Add tracking update
    const { error: trackingError } = await supabase
      .from('tracking_updates')
      .insert({
        shipment_id: shipment.id,
        status,
        location,
        notes,
        completed: true,
        timestamp: new Date()
      })

    if (trackingError) throw trackingError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating shipment:', error)
    return NextResponse.json({ error: 'Failed to update shipment' }, { status: 500 })
  }
}