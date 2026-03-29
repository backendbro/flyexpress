// Using OpenStreetMap's Nominatim (FREE)
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number; displayName: string } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
    )
    const data = await response.json()
    
    if (data && data[0]) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name
      }
    }
    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

// Batch geocoding for multiple addresses
export async function batchGeocodeAddresses(addresses: string[]): Promise<Map<string, { lat: number; lng: number; displayName: string }>> {
  const results = new Map()
  
  // Add delay to respect Nominatim's usage policy (1 request per second)
  for (const address of addresses) {
    const result = await geocodeAddress(address)
    if (result) {
      results.set(address, result)
    }
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  return results
}