'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MapWithTracking } from './MapWithTracking'
import { geocodeAddress } from '@/lib/geocoding'

interface RealTimeMapTrackerProps {
  awb: string
}

export function RealTimeMapTracker({ awb }: RealTimeMapTrackerProps) {
  const [shipment, setShipment] = useState<any>(null)
  const [currentLocation, setCurrentLocation] = useState<any>(null)
  const [trackingHistory, setTrackingHistory] = useState<any[]>([])
  const [originCoords, setOriginCoords] = useState<{ lat: number; lng: number; name: string } | null>(null)
  const [destCoords, setDestCoords] = useState<{ lat: number; lng: number; name: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!awb) return

    const fetchShipmentData = async () => {
      // Fetch shipment details
      const { data: shipmentData, error: shipmentError } = await supabase
        .from('shipments')
        .select('*')
        .eq('awb', awb)
        .single()

      if (shipmentError || !shipmentData) {
        setLoading(false)
        return
      }

      setShipment(shipmentData)

      // Geocode origin if coordinates not stored
      if (shipmentData.origin_lat && shipmentData.origin_lng) {
        setOriginCoords({
          lat: shipmentData.origin_lat,
          lng: shipmentData.origin_lng,
          name: shipmentData.origin
        })
      } else {
        const originGeo = await geocodeAddress(shipmentData.origin)
        if (originGeo) {
          setOriginCoords({
            lat: originGeo.lat,
            lng: originGeo.lng,
            name: shipmentData.origin
          })
          // Store coordinates for future use
          await supabase
            .from('shipments')
            .update({ origin_lat: originGeo.lat, origin_lng: originGeo.lng })
            .eq('id', shipmentData.id)
        }
      }

      // Geocode destination
      if (shipmentData.destination_lat && shipmentData.destination_lng) {
        setDestCoords({
          lat: shipmentData.destination_lat,
          lng: shipmentData.destination_lng,
          name: shipmentData.destination
        })
      } else {
        const destGeo = await geocodeAddress(shipmentData.destination)
        if (destGeo) {
          setDestCoords({
            lat: destGeo.lat,
            lng: destGeo.lng,
            name: shipmentData.destination
          })
          await supabase
            .from('shipments')
            .update({ destination_lat: destGeo.lat, destination_lng: destGeo.lng })
            .eq('id', shipmentData.id)
        }
      }

      // Fetch location history
      const { data: locations } = await supabase
        .from('shipment_locations')
        .select('*')
        .eq('shipment_id', shipmentData.id)
        .order('timestamp', { ascending: false })

      if (locations && locations.length > 0) {
        setCurrentLocation(locations[0])
        setTrackingHistory(locations.slice(1))
      }

      setLoading(false)
    }

    fetchShipmentData()

    // Set up real-time subscription for location updates
    const channel = supabase
      .channel(`shipment-location-${awb}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'shipment_locations'
        },
        async (payload) => {
          // Refresh to get the latest location
          const { data: latestLocation } = await supabase
            .from('shipment_locations')
            .select('*')
            .eq('shipment_id', shipment?.id)
            .order('timestamp', { ascending: false })
            .limit(1)
            .single()

          if (latestLocation) {
            setCurrentLocation(latestLocation)
            setTrackingHistory(prev => [latestLocation, ...prev])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [awb, supabase, shipment?.id])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <p className="mt-2 text-gray-500">Loading map data...</p>
      </div>
    )
  }

  if (!originCoords || !destCoords) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
        <i className="fas fa-map-marked-alt text-yellow-600 text-3xl mb-3"></i>
        <p className="text-gray-700">Unable to load map coordinates for this shipment.</p>
        <p className="text-sm text-gray-500 mt-1">Please contact support for assistance.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ height: '500px' }}>
        <MapWithTracking
          origin={originCoords}
          destination={destCoords}
          currentLocation={currentLocation ? {
            lat: currentLocation.lat,
            lng: currentLocation.lng,
            timestamp: currentLocation.timestamp,
            status: currentLocation.status,
            locationName: currentLocation.location_name
          } : undefined}
          trackingHistory={trackingHistory.map(h => ({
            lat: h.lat,
            lng: h.lng,
            timestamp: h.timestamp,
            status: h.status,
            locationName: h.location_name
          }))}
        />
      </div>
      
      {/* Live indicator */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-600">Live tracking active</span>
        </div>
        <span className="text-gray-400">
          Last update: {currentLocation ? new Date(currentLocation.timestamp).toLocaleString() : 'N/A'}
        </span>
      </div>
    </div>
  )
}