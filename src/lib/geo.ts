import { Coordinates } from './types'

const EARTH_RADIUS_METERS = 6371000

function toRadians(value: number) {
  return (value * Math.PI) / 180
}

export function distanceMeters(from: Coordinates, to: Coordinates) {
  const dLat = toRadians(to.lat - from.lat)
  const dLng = toRadians(to.lng - from.lng)
  const lat1 = toRadians(from.lat)
  const lat2 = toRadians(to.lat)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return EARTH_RADIUS_METERS * c
}

export function formatDistance(distance: number) {
  if (distance < 1000) {
    return `${Math.round(distance)} м`
  }

  return `${(distance / 1000).toFixed(1)} км`
}
