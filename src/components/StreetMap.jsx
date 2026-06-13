// src/components/StreetMap.jsx
// Street-routing map using Leaflet + OSRM (free, no API key needed)

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'

// Fix default Leaflet marker icons (Vite asset-pipeline issue)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const STORE_COORDS = [30.0444, 31.2357] // Nosej HQ — Central Cairo
const OSRM_URL = 'https://router.project-osrm.org/route/v1/driving'

// Custom store icon
const storeIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      width:36px;height:36px;border-radius:50% 50% 50% 0;
      background:#131b2e;border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.35);
      transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
    ">
      <span style="transform:rotate(45deg);font-size:16px;line-height:1;">🏪</span>
    </div>`,
  iconSize:   [36, 36],
  iconAnchor: [18, 36],
  popupAnchor:[0, -40],
})

// Custom user icon
const userIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      width:20px;height:20px;border-radius:50%;
      background:#2a14b4;border:3px solid white;
      box-shadow:0 2px 8px rgba(42,20,180,0.5);
    "></div>`,
  iconSize:   [20, 20],
  iconAnchor: [10, 10],
  popupAnchor:[0, -14],
})

/**
 * Fetch a road-based route from OSRM and return an array of LatLng coordinates.
 */
async function fetchRoute(from, to) {
  const url = `${OSRM_URL}/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`
  const res  = await fetch(url)
  if (!res.ok) throw new Error('OSRM request failed')
  const data = await res.json()
  if (data.code !== 'Ok' || !data.routes?.length) throw new Error('No route found')

  // GeoJSON coords are [lng, lat] — Leaflet wants [lat, lng]
  return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng])
}

export default function StreetMap({ productTitle }) {
  const mapRef     = useRef(null)
  const mapInst    = useRef(null)
  const routeLayer = useRef(null)

  const [status, setStatus]     = useState('idle') // idle | loading | success | error | denied
  const [distance, setDistance] = useState(null)
  const [duration, setDuration] = useState(null)
  const [userCoords, setUserCoords] = useState(null)

  // Initialise map once
  useEffect(() => {
    if (mapInst.current) return

    mapInst.current = L.map(mapRef.current, {
      center: STORE_COORDS,
      zoom:   13,
      zoomControl: true,
      attributionControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(mapInst.current)

    // Store marker
    L.marker(STORE_COORDS, { icon: storeIcon })
      .addTo(mapInst.current)
      .bindPopup(`
        <div style="font-family:Inter,sans-serif;min-width:140px;">
          <strong style="font-size:13px;">A R T. Gallery Store</strong><br/>
          <span style="font-size:11px;color:#666;">Central Cairo</span>
        </div>`)
      .openPopup()

    return () => {
      mapInst.current?.remove()
      mapInst.current = null
    }
  }, [])

  const drawRoute = async (lat, lng) => {
    setStatus('loading')
    setUserCoords([lat, lng])

    try {
      // Fetch road-based route from OSRM
      const routeCoords = await fetchRoute([lat, lng], STORE_COORDS)

      // Remove previous route layer
      if (routeLayer.current) {
        mapInst.current.removeLayer(routeLayer.current)
      }

      // Draw the road route polyline
      routeLayer.current = L.polyline(routeCoords, {
        color:     '#2a14b4',
        weight:    5,
        opacity:   0.85,
        lineJoin:  'round',
        lineCap:   'round',
      }).addTo(mapInst.current)

      // Add user location marker
      L.marker([lat, lng], { icon: userIcon })
        .addTo(mapInst.current)
        .bindPopup('<span style="font-size:12px;font-family:Inter,sans-serif;">Your Location</span>')

      // Fit bounds to show full route
      mapInst.current.fitBounds(routeLayer.current.getBounds(), { padding: [40, 40] })

      // Calculate distance & ETA from OSRM response (re-fetch to get summary)
      const summaryUrl = `${OSRM_URL}/${lng},${lat};${STORE_COORDS[1]},${STORE_COORDS[0]}?overview=false`
      const summRes    = await fetch(summaryUrl)
      if (summRes.ok) {
        const summData = await summRes.json()
        if (summData.routes?.[0]) {
          const dist = summData.routes[0].distance // metres
          const dur  = summData.routes[0].duration // seconds
          setDistance((dist / 1000).toFixed(1))
          setDuration(Math.ceil(dur / 60))
        }
      }

      setStatus('success')
    } catch (err) {
      console.error('Routing error:', err)
      // Fallback: draw straight-line
      if (routeLayer.current) mapInst.current.removeLayer(routeLayer.current)
      routeLayer.current = L.polyline([[lat, lng], STORE_COORDS], {
        color: '#2a14b4', weight: 4, opacity: 0.6, dashArray: '8,6',
      }).addTo(mapInst.current)
      mapInst.current.fitBounds(routeLayer.current.getBounds(), { padding: [40, 40] })
      setStatus('error')
    }
  }

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setStatus('denied')
      return
    }
    setStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => drawRoute(pos.coords.latitude, pos.coords.longitude),
      ()    => setStatus('denied'),
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Map container */}
      <div
        ref={mapRef}
        className="w-full rounded-2xl overflow-hidden border border-gray-100"
        style={{ height: 340 }}
      />

      {/* Controls */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleLocate}
          disabled={status === 'loading'}
          className={`
            flex items-center justify-center gap-2 w-full py-3 rounded-xl
            font-black text-xs tracking-widest uppercase transition-all
            ${status === 'loading'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-[#131b2e] text-white hover:bg-black active:scale-[0.98]'}
          `}
        >
          {status === 'loading' ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Calculating Route…
            </>
          ) : (
            <>
              📍 Get Directions to Store
            </>
          )}
        </button>

        {/* Route summary */}
        {status === 'success' && distance && (
          <div className="flex gap-3">
            <div className="flex-1 bg-green-50 border border-green-100 rounded-xl p-3 text-center">
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Distance</p>
              <p className="text-xl font-black text-green-700">{distance} km</p>
            </div>
            <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Drive Time</p>
              <p className="text-xl font-black text-blue-700">{duration} min</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <p className="text-[11px] text-amber-600 font-bold text-center bg-amber-50 rounded-xl px-3 py-2 border border-amber-100">
            ⚠️ Showing approximate route — street data unavailable
          </p>
        )}

        {status === 'denied' && (
          <p className="text-[11px] text-red-500 font-bold text-center bg-red-50 rounded-xl px-3 py-2 border border-red-100">
            Location access denied. Please enable location in your browser.
          </p>
        )}

        <p className="text-[10px] text-gray-400 font-bold text-center">
          🏪 A R T. Gallery Store — Central Cairo, Egypt
        </p>
      </div>
    </div>
  )
}
