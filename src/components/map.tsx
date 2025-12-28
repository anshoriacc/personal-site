"use client";

import { RefAttributes, useEffect, useMemo, useRef } from "react";
import {
  Circle,
  MapContainer,
  MapContainerProps,
  TileLayer,
  useMap,
} from "react-leaflet";
import { LatLngExpression, Map as TMap, latLng } from "leaflet";
import { cn } from "@/lib/utils";

type TView = {
  center: LatLngExpression;
  zoom: number;
};

type MapControllerProps = {
  isHovered: boolean;
  jakartaView: TView;
  indonesiaView: TView;
};

const MapController = ({
  isHovered,
  jakartaView,
  indonesiaView,
}: MapControllerProps) => {
  const map = useMap();
  const lastFlyRef = useRef<number>(0);
  const prevIsHovered = useRef<boolean>(isHovered);

  useEffect(() => {
    // Only react to actual hover state transitions
    const entering = isHovered && !prevIsHovered.current;
    const leaving = !isHovered && prevIsHovered.current;

    // Update prev for next run
    prevIsHovered.current = isHovered;

    if (!entering && !leaving) return;

    // Choose target view based on current hover state
    const target = isHovered ? jakartaView : indonesiaView;

    // Avoid calling flyTo if we're already very close to the target view
    try {
      const currentZoom = map.getZoom();
      const currentCenter = map.getCenter();
      const targetLatLng = latLng(target.center as LatLngExpression);
      const centerDistance = currentCenter.distanceTo(targetLatLng);

      const zoomDiff = Math.abs(currentZoom - target.zoom);

      // If both zoom and center are already very close, skip the animation
      if (zoomDiff < 0.2 && centerDistance < 100) return;

      // Throttle repeated toggles to avoid interrupting animations constantly
      const now = Date.now();
      const THROTTLE_MS = 600;
      if (now - lastFlyRef.current < THROTTLE_MS) return;
      lastFlyRef.current = now;
    } catch {
      // If anything goes wrong reading the map, fall back to a single view change
    }

    if (entering) {
      // Smooth zoom in when user intentionally hovered — use setView with animate
      map.setView(target.center as LatLngExpression, target.zoom, { animate: true });
    } else {
      // On leave, snap back instantly to avoid interrupting animations
      map.setView(target.center as LatLngExpression, target.zoom, { animate: false });
    }
  }, [isHovered, jakartaView, indonesiaView, map]);

  return null;
};

export const Map = ({
  isZoomed = false,
  className,
  ...props
}: { isZoomed?: boolean } & MapContainerProps & RefAttributes<TMap>) => {
  const mapRef = useRef(null);

  const indonesiaView: TView = useMemo(
    () => ({
      center: [-2.5489, 118.0149],
      zoom: 2,
    }),
    [],
  );

  const jakartaView: TView = useMemo(
    () => ({
      center: [-6.2088, 106.8456],
      zoom: 8,
    }),
    [],
  );

  return (
    <MapContainer
      ref={mapRef}
      center={indonesiaView.center}
      zoom={indonesiaView.zoom}
      scrollWheelZoom={false}
      zoomControl={false}
      doubleClickZoom={false}
      dragging={false}
      attributionControl={false}
      className={cn("bg-#d4dadc pointer-events-none size-full", className)}
      {...props}>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" />
      <Circle
        center={jakartaView.center}
        radius={200000}
        pathOptions={{
          color: "#fb2c36",
          weight: 1,
          fill: false,
          opacity: isZoomed ? 0 : 1,
        }}
      />

      <MapController
        isHovered={isZoomed}
        jakartaView={jakartaView}
        indonesiaView={indonesiaView}
      />
    </MapContainer>
  );
};
