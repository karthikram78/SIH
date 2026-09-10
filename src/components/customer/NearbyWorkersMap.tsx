'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Worker, LocationCoordinates } from '@/types';
import {
  MapPin,
  Navigation,
  Compass,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Key,
  LocateFixed,
  CheckCircle2,
  X,
  Map as MapIcon,
} from 'lucide-react';

interface NearbyWorkersMapProps {
  userLocation: LocationCoordinates;
  workers: Worker[];
  selectedWorkerId?: string;
  onSelectWorker: (worker: Worker) => void;
  onLocationChange?: (location: LocationCoordinates) => void;
}

declare global {
  interface Window {
    google?: any;
    L?: any;
  }
}

export const NearbyWorkersMap: React.FC<NearbyWorkersMapProps> = ({
  userLocation,
  workers,
  selectedWorkerId,
  onSelectWorker,
  onLocationChange,
}) => {
  const [viewProvider, setViewProvider] = useState<'leaflet' | 'georadar' | 'google'>('leaflet');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  // Google Maps API Key state
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [mapLoadError, setMapLoadError] = useState<string | null>(null);

  // Leaflet references
  const leafletMapRef = useRef<HTMLDivElement>(null);
  const leafletInstanceRef = useRef<any>(null);
  const leafletMarkersRef = useRef<any[]>([]);
  const leafletUserMarkerRef = useRef<any>(null);
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  // Google Maps references
  const googleMapRef = useRef<HTMLDivElement>(null);
  const googleMapInstanceRef = useRef<any>(null);
  const googleMarkersRef = useRef<any[]>([]);
  const googleUserMarkerRef = useRef<any>(null);
  const googleInfoWindowRef = useRef<any>(null);

  // Avadi-area landmarks used for quick map navigation and dispatch coverage.
  const quickFlyLocalities = [
    { name: 'Avadi', lat: 13.1147, lng: 80.1048 },
    { name: 'Avadi Railway Station', lat: 13.1193, lng: 80.1017 },
    { name: 'Pattabiram', lat: 13.1234, lng: 80.0648 },
    { name: 'Thiruninravur', lat: 13.1236, lng: 80.0272 },
    { name: 'Hindu College', lat: 13.1158, lng: 80.1392 },
    { name: 'Paruthipattu', lat: 13.0875, lng: 80.1075 },
  ];

  // Initialize API Key from localStorage or env
  useEffect(() => {
    const envKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    const storedKey = typeof window !== 'undefined' ? localStorage.getItem('google_maps_api_key') || '' : '';
    setApiKey(storedKey || envKey);
  }, []);

  // --------------------------------------------------------------------------
  // LEAFLET OPENSTREETMAP INITIALIZATION (Primary Free Provider)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Inject Leaflet CSS
    const leafletCssId = 'leaflet-css-cdn';
    if (!document.getElementById(leafletCssId)) {
      const link = document.createElement('link');
      link.id = leafletCssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    // 2. Inject Leaflet JS
    const leafletJsId = 'leaflet-js-cdn';
    let script = document.getElementById(leafletJsId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = leafletJsId;
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = () => {
        setIsLeafletReady(true);
      };
      document.head.appendChild(script);
    } else if (window.L) {
      setIsLeafletReady(true);
    }
  }, []);

  // Initialize Leaflet Map Instance
  const initLeafletMap = useCallback(() => {
    if (!leafletMapRef.current || !window.L || viewProvider !== 'leaflet') return;

    try {
      // If already initialized, remove old instance
      if (leafletInstanceRef.current) {
        leafletInstanceRef.current.remove();
        leafletInstanceRef.current = null;
      }

      const L = window.L;
      const map = L.map(leafletMapRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 13,
        zoomControl: false, // We render custom UI controls
      });

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      leafletInstanceRef.current = map;

      // Customer Location Marker (Pulsing Circle Marker)
      const userMarker = L.circleMarker([userLocation.lat, userLocation.lng], {
        radius: 9,
        fillColor: '#0284c7',
        color: '#ffffff',
        weight: 3,
        fillOpacity: 1,
      }).addTo(map);

      userMarker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; color: #0f172a; padding: 2px;">
          <div style="font-weight: 800; color: #0284c7; margin-bottom: 2px;">📍 Your Location (Citizen)</div>
          <div style="font-weight: 600;">${userLocation.address}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Avadi • Dispatch Center</div>
        </div>
      `);
      leafletUserMarkerRef.current = userMarker;

      // Add map click listener to set user location
      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        onLocationChange?.({
          ...userLocation,
          lat: Number(lat.toFixed(5)),
          lng: Number(lng.toFixed(5)),
          address: `Map Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        });
        
        if (leafletUserMarkerRef.current) {
          leafletUserMarkerRef.current.setLatLng([lat, lng]);
          leafletUserMarkerRef.current.getPopup().setContent(`
            <div style="font-family: inherit; font-size: 12px; color: #0f172a; padding: 2px;">
              <div style="font-weight: 800; color: #0284c7; margin-bottom: 2px;">📍 Your Location (Citizen)</div>
              <div style="font-weight: 600;">Map Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}</div>
              <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Selected via map tap</div>
            </div>
          `);
        }
      });

      // Worker Markers
      leafletMarkersRef.current = [];
      workers.forEach((worker) => {
        const isSelected = worker.id === selectedWorkerId;
        const pinColor =
          worker.availability === 'available'
            ? '#10b981'
            : worker.availability === 'busy'
            ? '#f59e0b'
            : '#94a3b8';

        // Custom DivIcon pin
        const customIcon = L.divIcon({
          className: 'custom-leaflet-worker-pin',
          html: `
            <div style="
              width: 32px;
              height: 32px;
              background-color: ${isSelected ? '#ea580c' : pinColor};
              border: 2px solid #ffffff;
              border-radius: 9999px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 10px rgba(0,0,0,0.35);
              transform: translate(-50%, -50%);
              cursor: pointer;
              transition: transform 0.2s;
              ${isSelected ? 'transform: translate(-50%, -50%) scale(1.2); ring: 3px solid #f97316;' : ''}
            ">
              <span style="color: white; font-weight: 900; font-size: 12px;">${worker.primaryCategory.charAt(0)}</span>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([worker.location.lat, worker.location.lng], {
          icon: customIcon,
          title: worker.name,
        }).addTo(map);

        const popupContent = document.createElement('div');
        popupContent.style.fontFamily = 'inherit';
        popupContent.style.padding = '4px';
        popupContent.style.maxWidth = '230px';
        popupContent.style.color = '#0f172a';
        popupContent.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <img src="${worker.avatar}" style="width: 38px; height: 38px; border-radius: 9999px; object-fit: cover; border: 1.5px solid #cbd5e1;" />
            <div>
              <div style="font-weight: 800; font-size: 13px; line-height: 1.2;">${worker.name}</div>
              <div style="font-size: 11px; color: #64748b;">${worker.primaryCategory}</div>
            </div>
          </div>
          <div style="font-size: 11px; margin-bottom: 6px; display: flex; justify-content: space-between; border-top: 1px solid #f1f5f9; padding-top: 4px;">
            <span>Rating: <strong>${worker.rating.toFixed(1)} ⭐</strong></span>
            <span>Rate: <strong>₹${worker.baseChargePerHour}/hr</strong></span>
          </div>
          <div style="font-size: 10px; color: #0284c7; font-weight: 600; margin-bottom: 6px;">
            📍 ${worker.location.address}
          </div>
          <div style="font-size: 10px; color: ${worker.availability === 'available' ? '#059669' : '#d97706'}; font-weight: 700; margin-bottom: 8px;">
            ${worker.availability === 'available' ? '● Available for Dispatch' : '● Currently Busy'}
          </div>
          <button
            id="leaflet-select-${worker.id}"
            style="width: 100%; padding: 7px 0; background: linear-gradient(to right, #ea580c, #f97316); color: white; border: none; border-radius: 8px; font-weight: 800; font-size: 11px; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px;"
          >
            Select & Request Worker
          </button>
        `;

        marker.bindPopup(popupContent);

        marker.on('click', () => {
          onSelectWorker(worker);
          setTimeout(() => {
            const btn = document.getElementById(`leaflet-select-${worker.id}`);
            if (btn) {
              btn.onclick = () => {
                onSelectWorker(worker);
                marker.closePopup();
              };
            }
          }, 100);
        });

        leafletMarkersRef.current.push(marker);
      });
    } catch (err) {
      console.warn('Leaflet map initialization warning:', err);
    }
  }, [userLocation, workers, selectedWorkerId, viewProvider, onSelectWorker]);

  // Re-run Leaflet init when ready or coordinates change
  useEffect(() => {
    if (viewProvider === 'leaflet' && isLeafletReady) {
      initLeafletMap();
    }
  }, [viewProvider, isLeafletReady, initLeafletMap]);

  // Handle the Avadi coverage center.
  const handleFlyToLocality = (lat: number, lng: number) => {
    if (leafletInstanceRef.current && viewProvider === 'leaflet') {
      leafletInstanceRef.current.flyTo([lat, lng], 14, { duration: 1 });
    } else if (googleMapInstanceRef.current && viewProvider === 'google') {
      googleMapInstanceRef.current.panTo({ lat, lng });
      googleMapInstanceRef.current.setZoom(14);
    }
  };

  // Center on User GPS
  const handleLocateMe = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          onLocationChange?.({
            ...userLocation,
            lat: Number(newPos.lat.toFixed(5)),
            lng: Number(newPos.lng.toFixed(5)),
            address: `Live GPS: ${newPos.lat.toFixed(4)}, ${newPos.lng.toFixed(4)}`,
          });
          if (leafletInstanceRef.current && viewProvider === 'leaflet') {
            leafletInstanceRef.current.flyTo([newPos.lat, newPos.lng], 15);
            if (leafletUserMarkerRef.current) {
              leafletUserMarkerRef.current.setLatLng([newPos.lat, newPos.lng]);
            }
          } else if (googleMapInstanceRef.current && viewProvider === 'google') {
            googleMapInstanceRef.current.panTo(newPos);
            googleMapInstanceRef.current.setZoom(15);
          }
        },
        () => {
          // Fallback to the Avadi service center.
          handleFlyToLocality(userLocation.lat, userLocation.lng);
        }
      );
    } else {
      handleFlyToLocality(userLocation.lat, userLocation.lng);
    }
  };

  useEffect(() => {
    if (!selectedWorkerId) return;

    const selectedWorkerData = workers.find((worker) => worker.id === selectedWorkerId);
    if (!selectedWorkerData) return;

    const target = {
      lat: selectedWorkerData.location.lat,
      lng: selectedWorkerData.location.lng,
    };

    if (viewProvider === 'leaflet' && leafletInstanceRef.current) {
      leafletInstanceRef.current.flyTo([target.lat, target.lng], 14, { duration: 1.2 });
    }

    if (viewProvider === 'google' && googleMapInstanceRef.current) {
      googleMapInstanceRef.current.panTo(target);
      googleMapInstanceRef.current.setZoom(14);
    }
  }, [selectedWorkerId, viewProvider, workers]);

  // --------------------------------------------------------------------------
  // GOOGLE MAPS OPTIONAL PROVIDER
  // --------------------------------------------------------------------------
  const initGoogleMap = useCallback(() => {
    if (!googleMapRef.current || !window.google || !window.google.maps) return;

    try {
      const mapOptions = {
        center: { lat: userLocation.lat, lng: userLocation.lng },
        zoom: 14,
        mapTypeId: mapType,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
      };

      const map = new window.google.maps.Map(googleMapRef.current, mapOptions);
      googleMapInstanceRef.current = map;
      googleInfoWindowRef.current = new window.google.maps.InfoWindow();

      // Render Customer Marker
      googleUserMarkerRef.current = new window.google.maps.Marker({
        position: { lat: userLocation.lat, lng: userLocation.lng },
        map,
        title: 'Your Location (Customer)',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: '#0284c7',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        },
      });

      // Add map click listener to set user location
      map.addListener('click', (e: any) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        onLocationChange?.({
          ...userLocation,
          lat: Number(lat.toFixed(5)),
          lng: Number(lng.toFixed(5)),
          address: `Map Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        });
        
        if (googleUserMarkerRef.current) {
          googleUserMarkerRef.current.setPosition({ lat, lng });
        }
      });

      // Render Workers
      googleMarkersRef.current.forEach((m) => m.setMap(null));
      googleMarkersRef.current = [];

      workers.forEach((worker) => {
        const isSelected = worker.id === selectedWorkerId;
        const pinColor =
          worker.availability === 'available'
            ? '#10b981'
            : worker.availability === 'busy'
            ? '#f59e0b'
            : '#94a3b8';

        const marker = new window.google.maps.Marker({
          position: { lat: worker.location.lat, lng: worker.location.lng },
          map,
          title: `${worker.name} (${worker.primaryCategory})`,
          icon: {
            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
            fillColor: isSelected ? '#ea580c' : pinColor,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 1.5,
            scale: 1.6,
            anchor: new window.google.maps.Point(12, 22),
          },
        });

        marker.addListener('click', () => {
          onSelectWorker(worker);
          const content = `
            <div style="font-family: inherit; padding: 4px; max-width: 220px; color: #0f172a;">
              <div style="font-weight: 800; font-size: 13px;">${worker.name}</div>
              <div style="font-size: 11px; color: #64748b;">${worker.primaryCategory} • ₹${worker.baseChargePerHour}/hr</div>
              <button id="gmap-btn-${worker.id}" style="width: 100%; margin-top: 6px; padding: 6px 0; background: #ea580c; color: white; border: none; border-radius: 6px; font-weight: bold; font-size: 11px; cursor: pointer;">
                Select & Book
              </button>
            </div>
          `;
          googleInfoWindowRef.current.setContent(content);
          googleInfoWindowRef.current.open(map, marker);
          setTimeout(() => {
            const btn = document.getElementById(`gmap-btn-${worker.id}`);
            if (btn) btn.onclick = () => onSelectWorker(worker);
          }, 100);
        });

        googleMarkersRef.current.push(marker);
      });

      setMapLoadError(null);
    } catch (err: any) {
      setMapLoadError(err.message || 'Google Maps failed to initialize');
      setViewProvider('leaflet');
    }
  }, [userLocation, workers, selectedWorkerId, mapType, onSelectWorker]);

  useEffect(() => {
    if (viewProvider !== 'google') return;

    if (window.google && window.google.maps) {
      initGoogleMap();
      return;
    }

    const scriptId = 'google-maps-js-sdk';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      const keyParam = apiKey ? `key=${apiKey}&` : '';
      script.src = `https://maps.googleapis.com/maps/api/js?${keyParam}libraries=places,geometry&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => initGoogleMap();
      script.onerror = () => {
        setMapLoadError('Google Maps failed to load. Defaulting to OpenStreetMap.');
        setViewProvider('leaflet');
      };
      document.head.appendChild(script);
    } else {
      initGoogleMap();
    }
  }, [viewProvider, apiKey, initGoogleMap]);

  const handleSaveApiKey = (newKey: string) => {
    const trimmed = newKey.trim();
    setApiKey(trimmed);
    localStorage.setItem('google_maps_api_key', trimmed);
    setShowKeyModal(false);
    setViewProvider('google');
  };

  // --------------------------------------------------------------------------
  // Tactical GeoRadar projection for Avadi service coverage.
  // --------------------------------------------------------------------------
  const centerLat = userLocation.lat;
  const centerLng = userLocation.lng;
  const latSpan = 0.08;
  const lngSpan = 0.08;

  const getSvgCoords = (lat: number, lng: number) => {
    const x = ((lng - (centerLng - lngSpan / 2)) / lngSpan) * 800;
    const y = 500 - ((lat - (centerLat - latSpan / 2)) / latSpan) * 500;
    return { x, y };
  };

  const userCoords = getSvgCoords(userLocation.lat, userLocation.lng);
  const selectedWorker = workers.find((w) => w.id === selectedWorkerId);

  return (
    <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 relative h-[480px] md:h-[520px]">
      {/* Top Controls Header */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Badge: Map Mode Switcher */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="bg-slate-900/95 backdrop-blur-md p-1 rounded-xl border border-slate-700 shadow-xl flex items-center gap-1">
            <button
              onClick={() => setViewProvider('leaflet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewProvider === 'leaflet'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Avadi Streets (OSM)</span>
            </button>

            <button
              onClick={() => setViewProvider('georadar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewProvider === 'georadar'
                  ? 'bg-saffron-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>GeoRadar</span>
            </button>

            <button
              onClick={() => setViewProvider('google')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewProvider === 'google'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>Google Maps</span>
            </button>
          </div>
        </div>

        {/* Right Tools: Locate Me & Keys */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/95 backdrop-blur-md p-1 rounded-xl border border-slate-700 shadow-xl">
          <button
            onClick={handleLocateMe}
            className="p-2 rounded-lg text-slate-200 hover:text-emerald-400 hover:bg-slate-800 transition"
            title="Locate My Position in Avadi (GPS)"
          >
            <LocateFixed className="w-4 h-4" />
          </button>

          {viewProvider === 'leaflet' && (
            <>
              <button
                onClick={() => leafletInstanceRef.current && leafletInstanceRef.current.zoomIn()}
                className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 transition"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => leafletInstanceRef.current && leafletInstanceRef.current.zoomOut()}
                className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleFlyToLocality(13.1147, 80.1048)}
                className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 transition"
                title="Reset to Avadi"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}

          {viewProvider === 'google' && (
            <button
              onClick={() => {
                const next = mapType === 'roadmap' ? 'satellite' : 'roadmap';
                setMapType(next);
                if (googleMapInstanceRef.current) googleMapInstanceRef.current.setMapTypeId(next);
              }}
              className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 transition"
              title="Toggle Roadmap / Satellite"
            >
              <Layers className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setShowKeyModal(true)}
            className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-slate-800 text-amber-300 hover:bg-slate-700 border border-amber-500/30 transition flex items-center gap-1"
            title="Configure Google Maps API Key"
          >
            <Key className="w-3 h-3" />
            <span>{apiKey ? 'Key Set' : 'Google Key'}</span>
          </button>
        </div>
      </div>

      {/* Avadi coverage quick-fly chip */}
      <div className="absolute top-16 left-3 z-[1000] flex items-center gap-1.5 flex-wrap pointer-events-auto">
        <span className="bg-slate-900/90 text-slate-400 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider border border-slate-700">
          Fly To:
        </span>
        {quickFlyLocalities.map((loc) => (
          <button
            key={loc.name}
            onClick={() => handleFlyToLocality(loc.lat, loc.lng)}
            className="bg-slate-900/90 hover:bg-saffron-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-700 hover:border-saffron-500 transition shadow-sm"
          >
            📍 {loc.name}
          </button>
        ))}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 1. LEAFLET OPENSTREETMAP CONTAINER (Default & Free) */}
      {/* -------------------------------------------------------------------- */}
      {viewProvider === 'leaflet' && (
        <div className="w-full h-full relative">
          <div ref={leafletMapRef} className="w-full h-full z-10" />
          {!isLeafletReady && (
            <div className="absolute inset-0 bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Loading Avadi OpenStreetMap tiles...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 2. GOOGLE MAPS CONTAINER */}
      {/* -------------------------------------------------------------------- */}
      {viewProvider === 'google' && (
        <div className="w-full h-full relative">
          <div ref={googleMapRef} className="w-full h-full bg-slate-950" />
          {mapLoadError && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 p-6 text-center z-20">
              <div className="max-w-md space-y-3">
                <div className="text-rose-400 font-bold text-sm">{mapLoadError}</div>
                <p className="text-xs text-slate-400">
                  You can use Avadi Streets (OpenStreetMap) without any API key or billing required.
                </p>
                <button
                  onClick={() => setViewProvider('leaflet')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg transition"
                >
                  Switch to Avadi Streets (OSM)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 3. TACTICAL GEORADAR SVG (Chennai Coastline & Waterways) */}
      {/* -------------------------------------------------------------------- */}
      {viewProvider === 'georadar' && (
        <svg
          viewBox="0 0 800 500"
          className="w-full h-full object-cover cursor-grab select-none"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.3s ease-out' }}
        >
          <defs>
            <pattern id="radarGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
            </pattern>
            <radialGradient id="radarPing" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="800" height="500" fill="#0f172a" />
          <rect width="800" height="500" fill="url(#radarGrid)" />

            {/* Avadi coverage area */}
          <path
            d="M 680 0 Q 640 250 670 500 L 800 500 L 800 0 Z"
            fill="#0369a1"
            fillOpacity="0.2"
          />
          <text x="700" y="240" fill="#38bdf8" fontSize="11" opacity="0.6" fontWeight="bold" letterSpacing="3">
            AVADI SERVICE AREA
          </text>

          <path d="M 80 250 Q 350 120 700 250 Q 430 410 80 250 Z" fill="none" stroke="#0284c7" strokeWidth="8" strokeOpacity="0.35" />

          {/* Distance range rings */}
          <circle cx={userCoords.x} cy={userCoords.y} r="70" fill="none" stroke="#334155" strokeWidth="2" />
          <circle cx={userCoords.x} cy={userCoords.y} r="140" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx={userCoords.x} cy={userCoords.y} r="230" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="6 6" />

          {/* User Location Pin */}
          <circle cx={userCoords.x} cy={userCoords.y} r="10" fill="#0284c7" stroke="#ffffff" strokeWidth="3" />
          <text x={userCoords.x} y={userCoords.y - 14} fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
            YOU (Citizen - Avadi)
          </text>

          {/* Worker Pins */}
          {workers.map((worker) => {
            const coords = getSvgCoords(worker.location.lat, worker.location.lng);
            const isSelected = worker.id === selectedWorkerId;
            const pinColor =
              worker.availability === 'available'
                ? '#10b981'
                : worker.availability === 'busy'
                ? '#f59e0b'
                : '#94a3b8';

            return (
              <g
                key={worker.id}
                transform={`translate(${coords.x}, ${coords.y})`}
                onClick={() => onSelectWorker(worker)}
                className="cursor-pointer group"
              >
                <circle cx="0" cy="0" r={isSelected ? 16 : 12} fill={isSelected ? '#ea580c' : pinColor} stroke="#ffffff" strokeWidth="2" />
                <text x="0" y="4" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle">
                  {worker.primaryCategory.charAt(0)}
                </text>
                <text x="0" y="24" fill="#e2e8f0" fontSize="9" fontWeight="bold" textAnchor="middle">
                  {worker.name.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>
      )}

      {/* Map Legend Footer */}
      <div className="absolute bottom-3 left-3 right-3 z-[1000] flex items-center justify-between text-[11px] text-slate-300 pointer-events-none">
        <div className="pointer-events-auto bg-slate-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700 flex items-center gap-3 shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Available (Avadi)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Busy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Your Pin</span>
          </div>
        </div>

        {selectedWorker && (
          <div className="pointer-events-auto bg-saffron-600 text-white font-bold px-3.5 py-1.5 rounded-xl shadow-xl flex items-center gap-2 max-w-[48%] truncate">
            <span className="truncate">
              Selected: <strong>{selectedWorker.name}</strong> ({selectedWorker.primaryCategory} • ₹{selectedWorker.baseChargePerHour}/hr)
            </span>
            <span className="hidden sm:inline text-saffron-100">• {selectedWorker.location.address}</span>
          </div>
        )}
      </div>

      {/* Google Maps API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-saffron-600" />
                <h3 className="font-black text-sm text-slate-900">Google Maps Platform Setup</h3>
              </div>
              <button onClick={() => setShowKeyModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Enter your Google Maps API Key to enable official Google satellite and street view layers. (Note: Chennai OpenStreetMap is already active without an API key).
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Google Maps API Key</label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:ring-2 focus:ring-saffron-400 outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveApiKey(apiKey)}
                className="px-4 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs shadow-md"
              >
                Save & Load Google Maps
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
