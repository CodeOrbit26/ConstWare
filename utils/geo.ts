/**
 * Calculates the great-circle distance between two points (Haversine formula)
 * @returns distance in meters
 */
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
            
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return Math.round(R * c)
}

/**
 * Categorizes distance into attendance status
 */
export function getAttendanceStatusByDistance(distanceMeters: number) {
  if (distanceMeters <= 100) return { status: "normal", color: "text-success", bg: "bg-success/10" }
  if (distanceMeters <= 300) return { status: "off-site", color: "text-warning", bg: "bg-warning/10" }
  return { status: "suspicious", color: "text-danger", bg: "bg-danger/10" }
}
