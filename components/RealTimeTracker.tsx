'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface TrackingUpdate {
  id: string
  status: string
  location: string
  notes: string | null
  completed: boolean
  timestamp: string
}

interface Shipment {
  id: string
  awb: string
  sender: string
  receiver: string
  origin: string
  destination: string
  weight: number
  content: string
  status: string
  tracking_updates: TrackingUpdate[]
}

export function RealTimeTracker({ awb }: { awb: string }) {
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLive, setIsLive] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!awb) return

    let mounted = true

    // Fetch initial data
    const fetchShipment = async () => {
      try {
        const { data, error } = await supabase
          .from('shipments')
          .select(`
            *,
            tracking_updates (*)
          `)
          .eq('awb', awb)
          .single()

        if (error) throw error
        
        if (mounted && data) {
          // Sort updates by timestamp (newest first)
          const sortedUpdates = data.tracking_updates?.sort((a: any, b: any) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          ) || []
          
          setShipment({ ...data, tracking_updates: sortedUpdates })
          setLoading(false)
        }
      } catch (err) {
        console.error('Error fetching shipment:', err)
        if (mounted) {
          setError('Shipment not found')
          setLoading(false)
        }
      }
    }

    fetchShipment()

    // Set up real-time subscription for this shipment
    const channel = supabase
      .channel(`shipment-${awb}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'shipments',
          filter: `awb=eq.${awb}`
        },
        (payload) => {
          if (mounted) {
            setShipment(prev => prev ? { ...prev, ...payload.new } : null)
            setIsLive(true)
            setTimeout(() => setIsLive(false), 3000)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tracking_updates'
        },
        async (payload) => {
          if (mounted && shipment && payload.new.shipment_id === shipment.id) {
            // Refresh all tracking updates
            const { data } = await supabase
              .from('tracking_updates')
              .select('*')
              .eq('shipment_id', shipment.id)
              .order('timestamp', { ascending: false })
            
            if (data && mounted) {
              setShipment(prev => prev ? { ...prev, tracking_updates: data } : null)
              setIsLive(true)
              setTimeout(() => setIsLive(false), 3000)
            }
          }
        }
      )
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [awb, supabase])

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <p className="mt-2 text-gray-500">Loading tracking data...</p>
      </div>
    )
  }

  if (error || !shipment) {
    return (
      <div className="text-center py-8">
        <i className="fas fa-box-open text-4xl text-gray-400 mb-3"></i>
        <p className="text-gray-500">No shipment found with AWB: {awb}</p>
        <p className="text-sm text-gray-400 mt-2">Please check the AWB number and try again</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Live indicator */}
      {isLive && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-pulse z-50 flex items-center gap-2">
          <i className="fas fa-broadcast-tower"></i>
          Live Update
        </div>
      )}

      <div className="flex justify-between items-start flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <i className="fas fa-barcode text-gray-400"></i>
            <h3 className="font-bold text-gray-800">AWB: {shipment.awb}</h3>
          </div>
          <p className="text-sm text-gray-600">
            <i className="fas fa-map-marker-alt text-red-500 mr-1"></i>
            {shipment.origin} → {shipment.destination}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Weight: {shipment.weight} kg | Content: {shipment.content}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          shipment.status === 'Delivered' ? 'bg-green-100 text-green-800' :
          shipment.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {shipment.status}
        </span>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <i className="fas fa-history text-red-500"></i>
          Tracking History
          {isLive && <span className="text-xs text-green-600 ml-2">(Updated just now)</span>}
        </h4>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {shipment.tracking_updates && shipment.tracking_updates.length > 0 ? (
            shipment.tracking_updates.map((update, idx) => (
              <div key={update.id || idx} className="flex items-start gap-3">
                <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                  update.completed ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{update.status}</p>
                  <p className="text-sm text-gray-500">
                    {update.location} • {new Date(update.timestamp).toLocaleString()}
                  </p>
                  {update.notes && (
                    <p className="text-sm text-gray-600 mt-1 bg-white p-2 rounded-lg">
                      {update.notes}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No tracking updates available</p>
          )}
        </div>
      </div>

      {/* Delivery info if delivered */}
      {shipment.status === 'Delivered' && (
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-2">
            <i className="fas fa-check-circle text-green-600 text-xl"></i>
            <div>
              <p className="font-semibold text-green-800">Delivered Successfully</p>
              <p className="text-sm text-green-600">
                Your shipment has been delivered to the recipient
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}