'use client';

import React, { useState } from 'react';
import { Worker, LocationCoordinates } from '@/types';
import { MapPin, Navigation, Compass, Layers, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface NearbyWorkersMapProps {
  userLocation: LocationCoordinates;
  workers: Worker[];
  selectedWorkerId?: string;
  onSelectWorker: (worker: Worker) => void;
}

export const NearbyWorkersMap: React.FC<NearbyWorkersMapProps> = ({
  userLocation,
  workers,
  selectedWorkerId,
  onSelectWorker,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');

  // Convert lat/lng coordinates to SVG percentage coordinates centered on userLocation
  // Trichy bounds approximately lat 10.810 to 10.850, lng 78.670 to 78.710
  const centerLat = userLocation.lat;
  const centerLng = userLocation.lng;
  const latSpan = 0.045; // ~5 km range
  const lngSpan = 0.045;

  const getSvgCoords = (lat: number, lng: number) => {
    // Normalizing to 0 - 100% inside viewBox 0 0 800 500
    const x = ((lng - (centerLng - lngSpan / 2)) / lngSpan) * 800;
    const y = 500 - ((lat - (centerLat - latSpan / 2)) / latSpan) * 500;
    return { x, y };
  };

  const userCoords = getSvgCoords(userLocation.lat, userLocation.lng);
  const selectedWorker = workers.find((w) => w.id === selectedWorkerId);
  const selectedWorkerCoords = selectedWorker
    ? getSvgCoords(selectedWorker.location.lat, selectedWorker.location.lng)
    : null;

  return (
    <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 relative h-[420px] md:h-[480px]">
      {/* Map Control Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
          <Navigation className="w-3.5 h-3.5 text-saffron-400 animate-pulse" />
          <span>Namma Sevai GeoRadar • {userLocation.city}</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 shadow-lg">
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.15))}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Reset Map Center"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Interactive Map Canvas */}
      <svg
        viewBox="0 0 800 500"
        className="w-full h-full object-cover cursor-grab select-none"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.3s ease-out' }}
      >
        <defs>
          {/* Map Grid Pattern */}
          <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
          </pattern>

          {/* Radial radar gradients */}
          <radialGradient id="radarPulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
            <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>

        {/* Map Background with Road Grid simulation */}
        <rect width="800" height="500" fill="#0f172a" />
        <rect width="800" height="500" fill="url(#mapGrid)" />

        {/* Major Simulated Arterial Roads (Cauvery river & highway layout) */}
        {/* Cauvery River Waterway */}
        <path
          d="M -20 180 Q 200 160 400 200 T 820 170"
          fill="none"
          stroke="#0369a1"
          strokeWidth="18"
          strokeOpacity="0.35"
        />
        <text x="120" y="175" fill="#38bdf8" fontSize="10" opacity="0.6" fontWeight="bold" letterSpacing="2">
          CAUVERY RIVER LINK
        </text>

        {/* Major Ring Road & Cross Roads */}
        <circle cx={userCoords.x} cy={userCoords.y} r="80" fill="none" stroke="#334155" strokeWidth="3" />
        <circle cx={userCoords.x} cy={userCoords.y} r="160" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx={userCoords.x} cy={userCoords.y} r="260" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="6 6" />

        <line x1="0" y1="280" x2="800" y2="280" stroke="#334155" strokeWidth="4" />
        <line x1="420" y1="0" x2="420" y2="500" stroke="#334155" strokeWidth="4" />
        <line x1="150" y1="0" x2="650" y2="500" stroke="#1e293b" strokeWidth="3" />

        {/* Distance Range Indicator labels */}
        <text x={userCoords.x + 85} y={userCoords.y - 10} fill="#64748b" fontSize="9" fontWeight="bold">
          1.5 KM
        </text>
        <text x={userCoords.x + 165} y={userCoords.y - 10} fill="#64748b" fontSize="9" fontWeight="bold">
          3.5 KM
        </text>
        <text x={userCoords.x + 265} y={userCoords.y - 10} fill="#64748b" fontSize="9" fontWeight="bold">
          6.0 KM
        </text>

        {/* Radar wave pulse from user */}
        <circle
          cx={userCoords.x}
          cy={userCoords.y}
          r="180"
          fill="url(#radarPulse)"
          className="animate-ping-slow"
        />

        {/* Dynamic Route Polyline if worker is selected */}
        {selectedWorkerCoords && (
          <g>
            <path
              d={`M ${userCoords.x} ${userCoords.y} Q ${(userCoords.x + selectedWorkerCoords.x) / 2 + 30} ${(userCoords.y + selectedWorkerCoords.y) / 2 - 20} ${selectedWorkerCoords.x} ${selectedWorkerCoords.y}`}
              fill="none"
              stroke="url(#routeGrad)"
              strokeWidth="4"
              strokeDasharray="6 6"
              className="animate-pulse"
            />
          </g>
        )}

        {/* User GPS Pin */}
        <g transform={`translate(${userCoords.x}, ${userCoords.y})`}>
          <circle r="14" fill="#0284c7" opacity="0.3" className="animate-ping" />
          <circle r="8" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
          <text x="0" y="24" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
            YOU ARE HERE
          </text>
        </g>

        {/* Worker Pins */}
        {workers.map((worker) => {
          const coords = getSvgCoords(worker.location.lat, worker.location.lng);
          const isSelected = worker.id === selectedWorkerId;
          const isAvailable = worker.availability === 'available';
          const pinColor = isAvailable ? '#10b981' : worker.availability === 'busy' ? '#f59e0b' : '#64748b';

          return (
            <g
              key={worker.id}
              transform={`translate(${coords.x}, ${coords.y})`}
              className="cursor-pointer group"
              onClick={() => onSelectWorker(worker)}
            >
              {isSelected && (
                <circle r="22" fill="#f97316" opacity="0.35" className="animate-ping" />
              )}
              <circle
                r={isSelected ? 16 : 12}
                fill={isSelected ? '#ea580c' : pinColor}
                stroke="#ffffff"
                strokeWidth={isSelected ? 3 : 2}
                className="transition-all hover:scale-125"
              />

              {/* Pin Icon / Initial */}
              <text
                x="0"
                y="4"
                fill="#ffffff"
                fontSize={isSelected ? '10' : '8'}
                fontWeight="black"
                textAnchor="middle"
                pointerEvents="none"
              >
                {worker.primaryCategory.charAt(0)}
              </text>

              {/* Hover Badge / Label */}
              <g
                transform="translate(0, -22)"
                className={`${isSelected ? 'opacity-100' : 'opacity-85 group-hover:opacity-100'} transition-opacity`}
              >
                <rect
                  x="-45"
                  y="-14"
                  width="90"
                  height="18"
                  rx="6"
                  fill="#0f172a"
                  stroke={isSelected ? '#ea580c' : '#334155'}
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="-2"
                  fill="#f8fafc"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {worker.name.split(' ')[0]} • {worker.rating.toFixed(1)}⭐
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Map Legend Footer */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between text-[11px] text-slate-300 pointer-events-none">
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Busy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
            <span>Offline</span>
          </div>
        </div>

        {selectedWorker && (
          <div className="pointer-events-auto bg-saffron-600 text-white font-bold px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2">
            <span>Selected: {selectedWorker.name} ({selectedWorker.primaryCategory})</span>
          </div>
        )}
      </div>
    </div>
  );
};
