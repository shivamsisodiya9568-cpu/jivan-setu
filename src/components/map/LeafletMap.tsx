import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { GeoLocation } from '../../types/emergency';

interface LeafletMapProps {
  emergencyLocation?: GeoLocation;
  ambulanceLocation?: GeoLocation;
  hospitalLocation?: GeoLocation;
  height?: string;
  zoom?: number;
  interactive?: boolean;
  onLocationSelect?: (loc: { lat: number; lng: number }) => void;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  emergencyLocation,
  ambulanceLocation,
  hospitalLocation,
  height = '350px',
  zoom = 13,
  interactive = true,
  onLocationSelect
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  // Default coordinate: Delhi Medical Corridor
  const defaultCenter = [28.5672, 77.2100];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = emergencyLocation?.lat || defaultCenter[0];
      const initialLng = emergencyLocation?.lng || defaultCenter[1];

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom,
        zoomControl: interactive,
        dragging: interactive,
        scrollWheelZoom: false
      });

      // OpenStreetMap Tiles (Standard reliable, no API key needed)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      layersGroupRef.current = L.layerGroup().addTo(map);

      if (onLocationSelect) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
        });
      }

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers and route lines dynamically
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    const points: [number, number][] = [];

    // Custom Icon Generator using SVG
    const createCustomIcon = (emoji: string, bgColor: string, borderColor: string) => {
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background: ${bgColor};
            border: 2px solid ${borderColor};
            color: #fff;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            transform: translate(-50%, -50%);
          ">
            ${emoji}
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });
    };

    // 1. Emergency Location Marker
    if (emergencyLocation && emergencyLocation.lat && emergencyLocation.lng) {
      const emPt: [number, number] = [emergencyLocation.lat, emergencyLocation.lng];
      points.push(emPt);

      const emMarker = L.marker(emPt, {
        icon: createCustomIcon('📍', '#dc2626', '#ffffff'),
        draggable: !!onLocationSelect
      });

      emMarker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4;">
          <strong style="color: #dc2626;">🚨 Emergency Incident</strong><br/>
          <span>${emergencyLocation.address || 'Reported Location'}</span><br/>
          <small style="color: #64748b;">GPS: ${emergencyLocation.lat.toFixed(4)}, ${emergencyLocation.lng.toFixed(4)}</small>
        </div>
      `);

      if (onLocationSelect) {
        emMarker.on('dragend', (e: any) => {
          const pos = e.target.getLatLng();
          onLocationSelect({ lat: pos.lat, lng: pos.lng });
        });
      }

      group.addLayer(emMarker);
    }

    // 2. Ambulance Marker
    if (ambulanceLocation && ambulanceLocation.lat && ambulanceLocation.lng) {
      const ambPt: [number, number] = [ambulanceLocation.lat, ambulanceLocation.lng];
      points.push(ambPt);

      const ambMarker = L.marker(ambPt, {
        icon: createCustomIcon('🚑', '#0f2744', '#38bdf8')
      });

      ambMarker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4;">
          <strong style="color: #0f2744;">🚑 Assigned Ambulance 108</strong><br/>
          <span>${ambulanceLocation.address || 'Active Unit Location'}</span><br/>
          <span style="color: #059669; font-weight: bold;">Status: Dispatched & Tracking</span>
        </div>
      `);

      group.addLayer(ambMarker);
    }

    // 3. Hospital Marker
    if (hospitalLocation && hospitalLocation.lat && hospitalLocation.lng) {
      const hospPt: [number, number] = [hospitalLocation.lat, hospitalLocation.lng];
      points.push(hospPt);

      const hospMarker = L.marker(hospPt, {
        icon: createCustomIcon('🏥', '#047857', '#ffffff')
      });

      hospMarker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4;">
          <strong style="color: #047857;">🏥 Receiving Trauma Center</strong><br/>
          <span>${hospitalLocation.address || 'Apex Hospital'}</span><br/>
          <span style="color: #2563eb; font-weight: bold;">Pre-Alert Coordination Ready</span>
        </div>
      `);

      group.addLayer(hospMarker);
    }

    // Route Polyline (Ambulance -> Incident -> Hospital)
    if (points.length >= 2) {
      const polyline = L.polyline(points, {
        color: '#dc2626',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8'
      });
      group.addLayer(polyline);

      // Fit bounds to show all markers
      try {
        map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 15 });
      } catch {
        // fallback
      }
    } else if (points.length === 1) {
      map.setView(points[0], zoom);
    }
  }, [emergencyLocation, ambulanceLocation, hospitalLocation]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner z-0">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />
      <div className="absolute bottom-2 left-2 z-[400] bg-white/90 dark:bg-navy-900/90 backdrop-blur px-2.5 py-1 rounded text-[11px] text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700 shadow-sm pointer-events-none">
        OpenStreetMap • Leaflet Engine
      </div>
    </div>
  );
};
