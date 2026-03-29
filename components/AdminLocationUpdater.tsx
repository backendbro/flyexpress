'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AdminLocationUpdaterProps {
  shipmentId: string
  awb: string
  onLocationUpdate?: () => void
  currentLat?: number
  currentLng?: number
}

export function AdminLocationUpdater({ 
  shipmentId, 
  awb, 
  onLocationUpdate,
  currentLat,
  currentLng 
}: AdminLocationUpdaterProps) {
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [locationName, setLocationName] = useState('')
  const [status, setStatus] = useState('In Transit')
  const [loading, setLoading] = useState(false)
  const [useGeolocation, setUseGeolocation] = useState(false)
  const [searchAddress, setSearchAddress] = useState('')
  const [searching, setSearching] = useState(false)
  const [distanceToDest, setDistanceToDest] = useState<number | null>(null)
  const [distanceToOrigin, setDistanceToOrigin] = useState<number | null>(null)
  const [shipmentDetails, setShipmentDetails] = useState<any>(null)
  const supabase = createClient()

  // Fetch shipment details to calculate distances
  useEffect(() => {
    const fetchShipmentDetails = async () => {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('id', shipmentId)
        .single()
      
      if (!error && data) {
        setShipmentDetails(data)
      }
    }
    
    fetchShipmentDetails()
  }, [shipmentId, supabase])

  // Pre-fill current location if provided
  useEffect(() => {
    if (currentLat && currentLng) {
      setLat(currentLat.toString())
      setLng(currentLng.toString())
      setUseGeolocation(true)
    }
  }, [currentLat, currentLng])

  // Calculate distances when coordinates change
  useEffect(() => {
    if (lat && lng && shipmentDetails) {
      calculateDistances()
    }
  }, [lat, lng, shipmentDetails])

  const calculateDistances = async () => {
    if (!shipmentDetails) return

    const currentLatNum = parseFloat(lat)
    const currentLngNum = parseFloat(lng)

    // Calculate distance to origin if coordinates exist
    if (shipmentDetails.origin_lat && shipmentDetails.origin_lng) {
      const dist = calculateHaversineDistance(
        currentLatNum, currentLngNum,
        shipmentDetails.origin_lat, shipmentDetails.origin_lng
      )
      setDistanceToOrigin(dist)
    }

    // Calculate distance to destination if coordinates exist
    if (shipmentDetails.destination_lat && shipmentDetails.destination_lng) {
      const dist = calculateHaversineDistance(
        currentLatNum, currentLngNum,
        shipmentDetails.destination_lat, shipmentDetails.destination_lng
      )
      setDistanceToDest(dist)
    }
  }

  const calculateHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported')
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const newLat = position.coords.latitude
        const newLng = position.coords.longitude
        setLat(newLat.toString())
        setLng(newLng.toString())
        setUseGeolocation(true)
        
        // Reverse geocode to get location name
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}&zoom=18&addressdetails=1`
          )
          const data = await response.json()
          if (data.display_name) {
            // Extract city/town name
            const addressParts = data.display_name.split(',')
            const cityName = addressParts.slice(0, 3).join(',').trim()
            setLocationName(cityName)
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error)
        }
        
        setLoading(false)
      },
      (error) => {
        alert('Error getting location: ' + error.message)
        setLoading(false)
      }
    )
  }

  const searchAddressOnMap = async () => {
    if (!searchAddress) return
    
    setSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchAddress)}&format=json&limit=1`
      )
      const data = await response.json()
      
      if (data && data[0]) {
        setLat(data[0].lat)
        setLng(data[0].lon)
        setLocationName(data[0].display_name.split(',')[0])
        setUseGeolocation(true)
      } else {
        alert('Address not found')
      }
    } catch (error) {
      console.error('Geocoding error:', error)
      alert('Failed to search address')
    } finally {
      setSearching(false)
    }
  }

  const updateLocation = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Insert location update
      const { error: insertError } = await supabase
        .from('shipment_locations')
        .insert({
          shipment_id: shipmentId,
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          location_name: locationName,
          status: status,
          timestamp: new Date()
        })

      if (insertError) throw insertError

      // Update the shipment's current status
      await supabase
        .from('shipments')
        .update({ 
          status, 
          updated_at: new Date(),
          current_lat: parseFloat(lat),
          current_lng: parseFloat(lng)
        })
        .eq('id', shipmentId)

      alert('Location updated successfully!')
      
      // Reset form
      setLat('')
      setLng('')
      setLocationName('')
      setUseGeolocation(false)
      setDistanceToDest(null)
      setDistanceToOrigin(null)
      
      if (onLocationUpdate) onLocationUpdate()
    } catch (error) {
      console.error('Error updating location:', error)
      alert('Failed to update location')
    } finally {
      setLoading(false)
    }
  }

  // Get status color
  const getStatusColor = (statusValue: string) => {
    const colors: Record<string, string> = {
      'Booking Confirmed': 'bg-yellow-100 text-yellow-800',
      'Picked Up': 'bg-blue-100 text-blue-800',
      'In Transit': 'bg-purple-100 text-purple-800',
      'Arrived at Destination Hub': 'bg-indigo-100 text-indigo-800',
      'Out for Delivery': 'bg-orange-100 text-orange-800',
      'Delivered': 'bg-green-100 text-green-800'
    }
    return colors[statusValue] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 text-lg">
          <i className="fas fa-map-marker-alt text-red-500 mr-2"></i>
          Update Package Location
        </h3>
        <p className="text-sm text-gray-500 mt-1">AWB: <span className="font-mono font-semibold">{awb}</span></p>
      </div>
      
      <form onSubmit={updateLocation} className="space-y-5">
        {/* Quick Location Methods */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Quick Location Methods
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm disabled:opacity-50"
            >
              <i className="fas fa-location-dot mr-2"></i>
              Use My Current Location
            </button>
            
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                placeholder="Search address or city..."
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
              />
              <button
                type="button"
                onClick={searchAddressOnMap}
                disabled={searching || !searchAddress}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm disabled:opacity-50"
              >
                <i className="fas fa-search mr-2"></i>
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {useGeolocation && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              <i className="fas fa-check-circle mr-2"></i>
              Location coordinates captured
            </p>
          </div>
        )}
        
        {/* Coordinates Input */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitude * <span className="text-xs text-gray-400">(e.g., 28.6139)</span>
            </label>
            <input
              type="number"
              step="any"
              required
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="Enter latitude"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitude * <span className="text-xs text-gray-400">(e.g., 77.2090)</span>
            </label>
            <input
              type="number"
              step="any"
              required
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="Enter longitude"
            />
          </div>
        </div>
        
        {/* Distance Information */}
        {(distanceToOrigin !== null || distanceToDest !== null) && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-gray-700 mb-2">Distance Information</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {distanceToOrigin !== null && (
                <div>
                  <span className="text-gray-600">Distance from origin:</span>
                  <span className="ml-2 font-semibold text-blue-700">{distanceToOrigin.toFixed(1)} km</span>
                </div>
              )}
              {distanceToDest !== null && (
                <div>
                  <span className="text-gray-600">Distance to destination:</span>
                  <span className="ml-2 font-semibold text-green-700">{distanceToDest.toFixed(1)} km</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location Name / Description *
          </label>
          <input
            type="text"
            required
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
            placeholder="e.g., Delhi Sorting Center, Mumbai Hub"
          />
          <p className="text-xs text-gray-400 mt-1">This will be displayed to customers tracking their package</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
          >
            <option value="Booking Confirmed">📋 Booking Confirmed</option>
            <option value="Picked Up">📦 Picked Up</option>
            <option value="In Transit">🚚 In Transit</option>
            <option value="Arrived at Destination Hub">🏢 Arrived at Destination Hub</option>
            <option value="Out for Delivery">🚛 Out for Delivery</option>
            <option value="Delivered">✅ Delivered</option>
          </select>
        </div>
        
        {/* Current Status Preview */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Status Preview</p>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
              {status}
            </span>
            <span className="text-xs text-gray-400">
              Customers will see this status update
            </span>
          </div>
        </div>
        
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || !lat || !lng || !locationName}
            className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition disabled:opacity-50 font-medium"
          >
            {loading ? (
              <><i className="fas fa-spinner fa-spin mr-2"></i> Updating Location...</>
            ) : (
              <><i className="fas fa-save mr-2"></i> Update Location & Status</>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setLat('')
              setLng('')
              setLocationName('')
              setUseGeolocation(false)
              setSearchAddress('')
              setDistanceToDest(null)
              setDistanceToOrigin(null)
            }}
            className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Clear
          </button>
        </div>
      </form>
      
      {/* Help Text */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-400">
          <i className="fas fa-info-circle mr-1"></i>
          Tips: Use "Use My Current Location" to automatically get your coordinates, or search for an address. 
          The distance to origin/destination will auto-calculate when coordinates are entered.
        </p>
      </div>
    </div>
  )
}