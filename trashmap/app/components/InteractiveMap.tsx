"use client";

import React, { useEffect, useRef, useState } from "react";
import type { CircleMarker, LayerGroup, Map as LeafletMap, TileLayer } from "leaflet";
import {
  Award, ChevronRight, Crosshair, ExternalLink, Layers, LocateFixed,
  Map as MapIcon, Plus, Sparkles, X, ZoomIn, ZoomOut,
} from "lucide-react";
import { Bounty } from "@/lib/types";

interface InteractiveMapProps {
  bounties: Bounty[];
  selectedBounty: Bounty | null;
  onSelectBounty: (bounty: Bounty | null) => void;
  onOpenDetailModal: (bounty: Bounty) => void;
  onOpenPostBounty: () => void;
}

const MANILA_CENTER: [number, number] = [14.5906, 120.9818];

export default function InteractiveMap({
  bounties, selectedBounty, onSelectBounty, onOpenDetailModal, onOpenPostBounty,
}: InteractiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LayerGroup | null>(null);
  const locationMarkerRef = useRef<CircleMarker | null>(null);
  const tileLayersRef = useRef<Record<"map" | "satellite", TileLayer> | null>(null);
  const userPositionRef = useRef<[number, number] | null>(null);
  const selectRef = useRef(onSelectBounty);
  const [mapType, setMapType] = useState<"map" | "satellite">("map");
  const [mapReady, setMapReady] = useState(false);
  const [locationStatus, setLocationStatus] = useState<"locating" | "live" | "unavailable">("locating");

  useEffect(() => {
    selectRef.current = onSelectBounty;
  }, [onSelectBounty]);

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;
    let locationWatch: number | undefined;
    let resizeObserver: ResizeObserver | undefined;

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;
      const map = L.map(containerRef.current, {
        attributionControl: true, zoomControl: false, minZoom: 11, maxZoom: 19,
      }).setView(MANILA_CENTER, 14);
      const road = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19,
      }).addTo(map);
      const satellite = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Tiles &copy; Esri", maxZoom: 19 }
      );

      mapRef.current = map;
      tileLayersRef.current = { map: road, satellite };
      markersRef.current = L.layerGroup().addTo(map);
      map.on("click", () => selectRef.current(null));
      resizeObserver = new ResizeObserver(() => map.invalidateSize());
      resizeObserver.observe(containerRef.current);
      setMapReady(true);

      if (navigator.geolocation) {
        locationWatch = navigator.geolocation.watchPosition(
          ({ coords }) => {
            const point: [number, number] = [coords.latitude, coords.longitude];
            userPositionRef.current = point;
            if (!locationMarkerRef.current) {
              locationMarkerRef.current = L.circleMarker(point, {
                className: "trashmap-user-location", color: "#fff", fillColor: "#306D29",
                fillOpacity: 1, radius: 8, weight: 3,
              }).addTo(map).bindTooltip("Your live location");
            } else locationMarkerRef.current.setLatLng(point);
            setLocationStatus("live");
          },
          () => setLocationStatus("unavailable"),
          { enableHighAccuracy: true, maximumAge: 15_000, timeout: 10_000 }
        );
      } else setLocationStatus("unavailable");
    });

    return () => {
      cancelled = true;
      if (locationWatch !== undefined) navigator.geolocation.clearWatch(locationWatch);
      resizeObserver?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = null;
      locationMarkerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !markersRef.current) return;
    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled || !mapRef.current || !markersRef.current) return;
      markersRef.current.clearLayers();
      bounties.forEach((bounty) => {
        const selected = bounty.id === selectedBounty?.id;
        const state = bounty.isHighReward ? "event" : bounty.status.replace("_", "-");
        const icon = L.divIcon({
          className: "",
          html: `<span class="trashmap-marker trashmap-marker--${state}${selected ? " is-selected" : ""}"><b>${bounty.isHighReward ? "★" : "✦"}</b>${bounty.points}</span>`,
          iconAnchor: [30, 34], iconSize: [60, 34],
        });
        L.marker([bounty.location.lat, bounty.location.lng], {
          bubblingMouseEvents: false, icon, keyboard: true,
          title: `${bounty.title}, ${bounty.points} points`,
        }).on("click", () => selectRef.current(selected ? null : bounty)).addTo(markersRef.current!);
      });
      if (selectedBounty) {
        mapRef.current.panInside([selectedBounty.location.lat, selectedBounty.location.lng], {
          animate: true, padding: [80, 80],
        });
      }
    });
    return () => { cancelled = true; };
  }, [bounties, mapReady, selectedBounty]);

  const switchMapType = (type: "map" | "satellite") => {
    const map = mapRef.current;
    const layers = tileLayersRef.current;
    if (map && layers && type !== mapType) {
      map.removeLayer(layers[mapType]);
      layers[type].addTo(map);
    }
    setMapType(type);
  };

  const recenter = () => {
    const map = mapRef.current;
    if (map) map.flyTo(userPositionRef.current ?? MANILA_CENTER, userPositionRef.current ? 16 : 14);
  };

  return (
    <section className="relative h-full min-h-[500px] w-full overflow-hidden rounded-2xl border border-[#E8E2D5] bg-[#E9EFE6] shadow-md">
      <div ref={containerRef} className="absolute inset-0 z-0 h-full w-full" role="application" aria-label="Interactive map of cleanup bounties in Manila" />
      {!mapReady && <div className="absolute inset-0 z-10 grid place-items-center bg-[#F5F1E9] text-sm font-bold text-[#0D530E]">Loading live map…</div>}

      <div className="pointer-events-none absolute left-3 top-3 z-[500] flex max-w-[calc(100%-5rem)] flex-wrap gap-2">
        <div className="pointer-events-auto flex items-center gap-2 rounded-xl border border-[#E8E2D5] bg-white/95 px-3 py-2 text-xs font-black text-[#0D530E] shadow-md backdrop-blur-md">
          <span className={`h-2 w-2 rounded-full ${locationStatus === "live" ? "animate-pulse bg-[#306D29]" : "bg-[#A7A29A]"}`} />
          <span>{locationStatus === "live" ? "Live location on" : locationStatus === "locating" ? "Finding your location…" : "Live map · Manila"}</span>
        </div>
        <div className="pointer-events-auto flex rounded-xl border border-[#E8E2D5] bg-white/95 p-1 text-xs font-bold shadow-md backdrop-blur-md">
          {(["map", "satellite"] as const).map((type) => (
            <button key={type} type="button" onClick={() => switchMapType(type)} aria-pressed={mapType === type}
              className={`flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 capitalize transition-colors ${mapType === type ? "bg-[#0D530E] text-white" : "text-[#0D530E] hover:bg-[#F5F1E9]"}`}>
              {type === "map" ? <MapIcon className="h-3.5 w-3.5" /> : <Layers className="h-3.5 w-3.5" />}{type}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute right-3 top-3 z-[500] flex flex-col gap-2">
        <div className="flex flex-col overflow-hidden rounded-xl border border-[#E8E2D5] bg-white shadow-md">
          <button type="button" onClick={() => mapRef.current?.zoomIn()} className="cursor-pointer p-2.5 text-[#0D530E] hover:bg-[#F5F1E9]" aria-label="Zoom in"><ZoomIn className="h-4 w-4" /></button>
          <span className="h-px bg-[#E8E2D5]" />
          <button type="button" onClick={() => mapRef.current?.zoomOut()} className="cursor-pointer p-2.5 text-[#0D530E] hover:bg-[#F5F1E9]" aria-label="Zoom out"><ZoomOut className="h-4 w-4" /></button>
        </div>
        <button type="button" onClick={recenter} className="cursor-pointer rounded-xl border border-[#E8E2D5] bg-white p-2.5 text-[#306D29] shadow-md hover:bg-[#F5F1E9]" aria-label={locationStatus === "live" ? "Center on my location" : "Center on Manila"}>
          {locationStatus === "live" ? <LocateFixed className="h-4 w-4" /> : <Crosshair className="h-4 w-4" />}
        </button>
      </div>

      {selectedBounty && (
        <article className="absolute bottom-20 left-1/2 z-[500] w-[min(320px,calc(100%-2rem))] -translate-x-1/2 rounded-2xl border border-[#E8E2D5] bg-white p-3.5 shadow-2xl sm:bottom-auto sm:left-auto sm:right-4 sm:top-16 sm:translate-x-0">
          <button type="button" onClick={() => onSelectBounty(null)} className="absolute right-5 top-5 z-10 grid h-7 w-7 cursor-pointer place-items-center rounded-full bg-[#0D530E]/85 text-white shadow-md hover:bg-[#0D530E]" aria-label="Close bounty preview"><X className="h-4 w-4" /></button>
          <div className="relative mb-2.5 h-32 overflow-hidden rounded-xl border border-[#E8E2D5] bg-[#F5F1E9]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedBounty.beforeImageUrl} alt={selectedBounty.title} className="h-full w-full object-cover" />
            <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-lg bg-[#0D530E]/90 px-2.5 py-1 text-xs font-extrabold text-white shadow-sm backdrop-blur-sm"><Sparkles className="h-3.5 w-3.5" />{selectedBounty.points} Pts</span>
          </div>
          <div className="mb-1 flex items-start justify-between gap-2">
            <h4 className="truncate text-sm font-extrabold leading-snug text-[#0D530E]">{selectedBounty.title}</h4>
            <span className="flex shrink-0 items-center gap-1 rounded-lg border border-[#E8E2D5] bg-[#F5F1E9] px-2 py-0.5 text-xs font-bold text-[#0D530E]"><Award className="h-3.5 w-3.5 text-[#306D29]" />{selectedBounty.postedBy.reliabilityScore}%</span>
          </div>
          <p className="mb-2 truncate text-xs font-semibold text-[#306D29]">📍 {selectedBounty.location.address}</p>
          <div className="mb-3 flex items-center justify-between text-[11px] font-semibold text-[#0D530E]/80">
            <span>{selectedBounty.distanceMiles} mi · {selectedBounty.location.neighborhood}</span>
            <span className="rounded-md border border-[#E8E2D5] bg-[#F5F1E9] px-2 py-0.5 capitalize">{selectedBounty.wasteCategory}</span>
          </div>
          <div className="flex gap-2">
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedBounty.location.lat},${selectedBounty.location.lng}`} target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#E8E2D5] bg-[#F5F1E9] text-[#306D29] hover:bg-[#E8E2D5]" aria-label="Get directions"><ExternalLink className="h-4 w-4" /></a>
            <button type="button" onClick={() => onOpenDetailModal(selectedBounty)} className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl bg-[#306D29] px-3 py-2.5 text-xs font-extrabold text-white shadow-md transition-colors hover:bg-[#0D530E]">View & Claim <ChevronRight className="h-3.5 w-3.5" /></button>
          </div>
        </article>
      )}

      <div className="pointer-events-none absolute bottom-4 left-4 z-[400] hidden items-center gap-3 rounded-xl border border-[#E8E2D5] bg-white/95 p-2.5 text-[11px] font-bold text-[#0D530E] shadow-md backdrop-blur-md sm:flex">
        <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-[#306D29]" />Open</span>
        <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-[#C47A2C]" />In progress</span>
        <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-[#5B6596]" />Pending proof</span>
      </div>
      <button type="button" onClick={onOpenPostBounty} className="absolute bottom-5 right-5 z-[500] flex cursor-pointer items-center gap-2 rounded-full border border-white/30 bg-[#306D29] px-5 py-3.5 text-sm font-black text-white shadow-xl transition-all hover:bg-[#0D530E] active:scale-95">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20"><Plus className="h-4 w-4" /></span>Post Bounty
      </button>
    </section>
  );
}
