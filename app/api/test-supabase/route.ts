import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  
  // Test the connection
  const { data, error } = await supabase
    .from('shipments')
    .select('count', { count: 'exact', head: true })
  
  if (error) {
    return NextResponse.json({ 
      error: 'Connection failed', 
      details: error.message 
    }, { status: 500 })
  }
  
  return NextResponse.json({ 
    success: true, 
    message: 'Supabase connected successfully!' 
  })
}