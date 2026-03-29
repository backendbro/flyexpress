// 'use client'

// import { useEffect, useState, useRef } from 'react'
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
// import L from 'leaflet'
// import 'leaflet/dist/leaflet.css'

// // Fix for default marker icons in Next.js
// delete (L.Icon.Default.prototype as any)._getIconUrl
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: '/marker-icon-2x.png',
//   iconUrl: '/marker-icon.png',
//   shadowUrl: '/marker-shadow.png',
// })

// // Custom icons for different locations
// const originIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41]
// })

// const destinationIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41]
// })

// const currentLocationIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41]
// })

// // Component to auto-fit bounds to show all points
// function FitBounds({ points }: { points: Array<[number, number]> }) {
//   const map = useMap()
  
//   useEffect(() => {
//     if (points.length > 0) {
//       const bounds = L.latLngBounds(points)
//       map.fitBounds(bounds, { padding: [50, 50] })
//     }
//   }, [map, points])
  
//   return null
// }

// interface TrackingLocation {
//   lat: number
//   lng: number
//   timestamp: string
//   status: string
//   locationName: string
// }

// interface MapWithTrackingProps {
//   origin: { lat: number; lng: number; name: string }
//   destination: { lat: number; lng: number; name: string }
//   currentLocation?: TrackingLocation
//   trackingHistory?: TrackingLocation[]
//   onDistanceCalculated?: (distance: number, duration: number) => void
// }

// export function MapWithTracking({ 
//   origin, 
//   destination, 
//   currentLocation, 
//   trackingHistory = [],
//   onDistanceCalculated 
// }: MapWithTrackingProps) {
//   const [route, setRoute] = useState<Array<[number, number]>>([])
//   const [distance, setDistance] = useState<number | null>(null)
//   const [duration, setDuration] = useState<number | null>(null)
//   const [loading, setLoading] = useState(true)

//   // Calculate route using OSRM (Open Source Routing Machine) - FREE
//   useEffect(() => {
//     const fetchRoute = async () => {
//       try {
//         setLoading(true)
//         const response = await fetch(
//           `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`
//         )
//         const data = await response.json()
        
//         if (data.routes && data.routes[0]) {
//           const route = data.routes[0]
//           const coordinates = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]] as [number, number])
//           setRoute(coordinates)
//           setDistance(route.distance / 1000) // Convert to kilometers
//           setDuration(route.duration / 60) // Convert to minutes
          
//           if (onDistanceCalculated) {
//             onDistanceCalculated(route.distance / 1000, route.duration / 60)
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching route:', error)
//       } finally {
//         setLoading(false)
//       }
//     }
    
//     fetchRoute()
//   }, [origin, destination, onDistanceCalculated])

//   // Calculate Haversine distance between two points
//   const calculateHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
//     const R = 6371 // Earth's radius in km
//     const dLat = (lat2 - lat1) * Math.PI / 180
//     const dLon = (lon2 - lon1) * Math.PI / 180
//     const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//               Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//               Math.sin(dLon/2) * Math.sin(dLon/2)
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
//     return R * c
//   }

//   const center = {
//     lat: (origin.lat + destination.lat) / 2,
//     lng: (origin.lng + destination.lng) / 2
//   }

//   const allPoints = [
//     [origin.lat, origin.lng] as [number, number],
//     [destination.lat, destination.lng] as [number, number],
//     ...(currentLocation ? [[currentLocation.lat, currentLocation.lng] as [number, number]] : []),
//     ...trackingHistory.map(h => [h.lat, h.lng] as [number, number])
//   ]

//   return (
//     <div className="relative w-full h-full min-h-[500px]">
//       {loading && (
//         <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-10">
//           <div className="flex items-center gap-2">
//             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
//             <span className="text-sm">Calculating route...</span>
//           </div>
//         </div>
//       )}
      
//       <MapContainer
//         center={[center.lat, center.lng]}
//         zoom={6}
//         style={{ height: '100%', width: '100%', minHeight: '500px' }}
//         className="rounded-xl z-0"
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
        
//         {/* Origin Marker */}
//         <Marker position={[origin.lat, origin.lng]} icon={originIcon}>
//           <Popup>
//             <div className="text-center">
//               <strong>Origin</strong><br />
//               {origin.name}<br />
//               <span className="text-xs text-gray-500">
//                 Lat: {origin.lat.toFixed(4)}, Lng: {origin.lng.toFixed(4)}
//               </span>
//             </div>
//           </Popup>
//         </Marker>
        
//         {/* Destination Marker */}
//         <Marker position={[destination.lat, destination.lng]} icon={destinationIcon}>
//           <Popup>
//             <div className="text-center">
//               <strong>Destination</strong><br />
//               {destination.name}<br />
//               <span className="text-xs text-gray-500">
//                 Lat: {destination.lat.toFixed(4)}, Lng: {destination.lng.toFixed(4)}
//               </span>
//             </div>
//           </Popup>
//         </Marker>
        
//         {/* Current Location Marker */}
//         {currentLocation && (
//           <Marker position={[currentLocation.lat, currentLocation.lng]} icon={currentLocationIcon}>
//             <Popup>
//               <div className="text-center">
//                 <strong>Current Location</strong><br />
//                 {currentLocation.locationName}<br />
//                 <span className="text-xs text-gray-500">
//                   Status: {currentLocation.status}<br />
//                   Last update: {new Date(currentLocation.timestamp).toLocaleString()}
//                 </span>
//               </div>
//             </Popup>
//           </Marker>
//         )}
        
//         {/* Route Polyline */}
//         {route.length > 0 && (
//           <Polyline 
//             positions={route} 
//             color="#ef4444" 
//             weight={4} 
//             opacity={0.8}
//             dashArray="10, 10"
//           />
//         )}
        
//         {/* Tracking History Points */}
//         {trackingHistory.map((point, idx) => (
//           <Marker 
//             key={idx} 
//             position={[point.lat, point.lng]} 
//             icon={new L.Icon({
//               iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
//               shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//               iconSize: [25, 41],
//               iconAnchor: [12, 41],
//               popupAnchor: [1, -34],
//               shadowSize: [41, 41]
//             })}
//           >
//             <Popup>
//               <div className="text-center">
//                 <strong>Historical Location</strong><br />
//                 {point.locationName}<br />
//                 <span className="text-xs text-gray-500">
//                   {new Date(point.timestamp).toLocaleString()}
//                 </span>
//               </div>
//             </Popup>
//           </Marker>
//         ))}
        
//         <FitBounds points={allPoints} />
//       </MapContainer>
      
//       {/* Distance and Duration Info Panel */}
//       {(distance !== null || currentLocation) && (
//         <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 z-10">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {distance !== null && (
//               <>
//                 <div>
//                   <p className="text-xs text-gray-500">Total Distance</p>
//                   <p className="text-lg font-bold text-gray-800">{distance.toFixed(1)} km</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500">Est. Travel Time</p>
//                   <p className="text-lg font-bold text-gray-800">{Math.floor(duration || 0)} min</p>
//                 </div>
//               </>
//             )}
//             {currentLocation && (
//               <>
//                 <div>
//                   <p className="text-xs text-gray-500">Distance to Origin</p>
//                   <p className="text-lg font-bold text-gray-800">
//                     {calculateHaversineDistance(
//                       currentLocation.lat, currentLocation.lng,
//                       origin.lat, origin.lng
//                     ).toFixed(1)} km
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500">Distance to Destination</p>
//                   <p className="text-lg font-bold text-gray-800">
//                     {calculateHaversineDistance(
//                       currentLocation.lat, currentLocation.lng,
//                       destination.lat, destination.lng
//                     ).toFixed(1)} km
//                   </p>
//                 </div>
//               </>
//             )}
//           </div>
//           <div className="mt-2 pt-2 border-t border-gray-200">
//             <p className="text-xs text-gray-500 text-center">
//               <i className="fas fa-info-circle mr-1"></i>
//               Route data from OpenStreetMap | Live tracking updates every 30 seconds
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

'use client'

import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Next.js
// This is the correct way for React 18


// Custom icons for different locations
const originIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const destinationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const currentLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Component to auto-fit bounds to show all points
function FitBounds({ points }: { points: Array<[number, number]> }) {
  const map = useMap()
  
  useEffect(() => {
    if (points.length > 0 && map) {
      const bounds = L.latLngBounds(points)
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [map, points])
  
  return null
}

interface TrackingLocation {
  lat: number
  lng: number
  timestamp: string
  status: string
  locationName: string
}

interface MapWithTrackingProps {
  origin: { lat: number; lng: number; name: string }
  destination: { lat: number; lng: number; name: string }
  currentLocation?: TrackingLocation
  trackingHistory?: TrackingLocation[]
  onDistanceCalculated?: (distance: number, duration: number) => void
}

export function MapWithTracking({ 
  origin, 
  destination, 
  currentLocation, 
  trackingHistory = [],
  onDistanceCalculated 
}: MapWithTrackingProps) {
  const [route, setRoute] = useState<Array<[number, number]>>([])
  const [distance, setDistance] = useState<number | null>(null)
  const [duration, setDuration] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  

      useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    })
  }, [])

 
  // Calculate route using OSRM (Open Source Routing Machine) - FREE
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`
        )
        const data = await response.json()
        
        if (data.routes && data.routes[0]) {
          const route = data.routes[0]
          const coordinates = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]] as [number, number])
          setRoute(coordinates)
          setDistance(route.distance / 1000) // Convert to kilometers
          setDuration(route.duration / 60) // Convert to minutes
          
          if (onDistanceCalculated) {
            onDistanceCalculated(route.distance / 1000, route.duration / 60)
          }
        }
      } catch (error) {
        console.error('Error fetching route:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchRoute()
  }, [origin, destination, onDistanceCalculated])

  // Calculate Haversine distance between two points
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

  const center = {
    lat: (origin.lat + destination.lat) / 2,
    lng: (origin.lng + destination.lng) / 2
  }

  const allPoints = [
    [origin.lat, origin.lng] as [number, number],
    [destination.lat, destination.lng] as [number, number],
    ...(currentLocation ? [[currentLocation.lat, currentLocation.lng] as [number, number]] : []),
    ...trackingHistory.map(h => [h.lat, h.lng] as [number, number])
  ]

  return (
    <div className="relative w-full h-full min-h-[500px]">
      {loading && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-10">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
            <span className="text-sm">Calculating route...</span>
          </div>
        </div>
      )}
      
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={6}
        style={{ height: '100%', width: '100%', minHeight: '500px' }}
        className="rounded-xl z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Origin Marker */}
        <Marker position={[origin.lat, origin.lng]} icon={originIcon}>
          <Popup>
            <div className="text-center">
              <strong>Origin</strong><br />
              {origin.name}<br />
              <span className="text-xs text-gray-500">
                Lat: {origin.lat.toFixed(4)}, Lng: {origin.lng.toFixed(4)}
              </span>
            </div>
          </Popup>
        </Marker>
        
        {/* Destination Marker */}
        <Marker position={[destination.lat, destination.lng]} icon={destinationIcon}>
          <Popup>
            <div className="text-center">
              <strong>Destination</strong><br />
              {destination.name}<br />
              <span className="text-xs text-gray-500">
                Lat: {destination.lat.toFixed(4)}, Lng: {destination.lng.toFixed(4)}
              </span>
            </div>
          </Popup>
        </Marker>
        
        {/* Current Location Marker */}
        {currentLocation && (
          <Marker position={[currentLocation.lat, currentLocation.lng]} icon={currentLocationIcon}>
            <Popup>
              <div className="text-center">
                <strong>Current Location</strong><br />
                {currentLocation.locationName}<br />
                <span className="text-xs text-gray-500">
                  Status: {currentLocation.status}<br />
                  Last update: {new Date(currentLocation.timestamp).toLocaleString()}
                </span>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Route Polyline */}
        {route.length > 0 && (
          <Polyline 
            positions={route} 
            color="#ef4444" 
            weight={4} 
            opacity={0.8}
            dashArray="10, 10"
          />
        )}
        
        {/* Tracking History Points */}
        {trackingHistory.map((point, idx) => (
          <Marker 
            key={idx} 
            position={[point.lat, point.lng]} 
            icon={new L.Icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })}
          >
            <Popup>
              <div className="text-center">
                <strong>Historical Location</strong><br />
                {point.locationName}<br />
                <span className="text-xs text-gray-500">
                  {new Date(point.timestamp).toLocaleString()}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
        
        <FitBounds points={allPoints} />
      </MapContainer>
      
      {/* Distance and Duration Info Panel */}
      {(distance !== null || currentLocation) && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {distance !== null && (
              <>
                <div>
                  <p className="text-xs text-gray-500">Total Distance</p>
                  <p className="text-lg font-bold text-gray-800">{distance.toFixed(1)} km</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Est. Travel Time</p>
                  <p className="text-lg font-bold text-gray-800">{Math.floor(duration || 0)} min</p>
                </div>
              </>
            )}
            {currentLocation && (
              <>
                <div>
                  <p className="text-xs text-gray-500">Distance to Origin</p>
                  <p className="text-lg font-bold text-gray-800">
                    {calculateHaversineDistance(
                      currentLocation.lat, currentLocation.lng,
                      origin.lat, origin.lng
                    ).toFixed(1)} km
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Distance to Destination</p>
                  <p className="text-lg font-bold text-gray-800">
                    {calculateHaversineDistance(
                      currentLocation.lat, currentLocation.lng,
                      destination.lat, destination.lng
                    ).toFixed(1)} km
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              <i className="fas fa-info-circle mr-1"></i>
              Route data from OpenStreetMap | Live tracking updates every 30 seconds
            </p>
          </div>
        </div>
      )}
    </div>
  )
}