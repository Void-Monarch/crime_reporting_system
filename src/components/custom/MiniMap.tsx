"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface MiniMapProps {
  latitude: number;
  longitude: number;
  height?: string;
  width?: string;
  size?: "small" | "medium" | "large" | "xlarge";
  aspectRatio?: "square" | "wide" | "tall" | "ultrawide";
  zoom?: number;
  title?: string;
  showControls?: boolean;
  interactive?: boolean;
}

export default function MiniMap({
  latitude,
  longitude,
  height,
  width,
  size = "medium",
  aspectRatio,
  zoom = 15,
  title = "Location",
  showControls = true,
  interactive = false,
}: MiniMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define size presets
  const sizePresets = {
    small: { height: "120px", width: "100%" },
    medium: { height: "200px", width: "100%" },
    large: { height: "300px", width: "100%" },
    xlarge: { height: "400px", width: "100%" },
  };

  // Define aspect ratio presets
  const aspectRatioPresets = {
    square: { height: "250px", width: "250px" },
    wide: { height: "180px", width: "320px" },
    tall: { height: "320px", width: "180px" },
    ultrawide: { height: "150px", width: "400px" },
  };

  // Determine final dimensions with priority: custom dimensions > aspect ratio > size preset
  let mapDimensions;
  if (height || width) {
    // Custom dimensions take highest priority
    mapDimensions = {
      height: height || sizePresets[size].height,
      width: width || sizePresets[size].width,
    };
  } else if (aspectRatio) {
    // Aspect ratio takes second priority
    mapDimensions = aspectRatioPresets[aspectRatio];
  } else {
    // Size preset is default
    mapDimensions = sizePresets[size];
  }

  useEffect(() => {
    if (!mapRef.current || !latitude || !longitude) {
      setIsLoading(false);
      return;
    }

    // Validate coordinates
    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      setError("Invalid coordinates");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Clean up existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Create new map
      const map = L.map(mapRef.current, {
        zoomControl: showControls,
        scrollWheelZoom: interactive,
        doubleClickZoom: interactive,
        touchZoom: interactive,
        dragging: interactive,
        attributionControl: false,
      }).setView([latitude, longitude], zoom);

      // Add tile layer
      const tileLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }
      );

      tileLayer.addTo(map);

      // Add marker
      const marker = L.marker([latitude, longitude]).addTo(map);

      if (title) {
        marker
          .bindPopup(title, {
            closeButton: false,
            autoClose: false,
            closeOnClick: false,
          })
          .openPopup();
      }

      // Store map instance
      mapInstanceRef.current = map;

      // Wait for map to load
      setTimeout(() => {
        setIsLoading(false);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 100);
    } catch (err) {
      setError("Failed to load map");
      setIsLoading(false);
      console.error("Map error:", err);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, zoom, title, showControls, interactive]);

  if (!latitude || !longitude) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 border rounded-md"
        style={{ height: mapDimensions.height, width: mapDimensions.width }}
      >
        <p className="text-sm text-gray-500">No coordinates available</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex items-center justify-center bg-red-50 border border-red-200 rounded-md"
        style={{ height: mapDimensions.height, width: mapDimensions.width }}
      >
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div
      className="border rounded-md overflow-hidden relative"
      style={{ width: mapDimensions.width }}
    >
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10"
          style={{ height: mapDimensions.height, width: mapDimensions.width }}
        >
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        style={{ height: mapDimensions.height, width: mapDimensions.width }}
      />
    </div>
  );
}
