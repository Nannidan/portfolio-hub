export type UnitSystem = 'metric' | 'imperial'

export interface IssTelemetry {
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  visibility: string
  footprint: number
  timestamp: number
}

export interface TrailPoint {
  lat: number
  lon: number
}

export interface LaunchSite {
  id: string
  code: string
  name: string
  location: string
  lat: number
  lon: number
}

export interface SiteWeather {
  temperature: number
  humidity: number
  windSpeed: number
  weatherCode: number
  hourlyTemps: number[]
}

export interface SpaceArticle {
  id: number
  title: string
  url: string
  image_url: string
  news_site: string
  summary: string
  published_at: string
}
