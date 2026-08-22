"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type GeolocationStatus = "idle" | "loading" | "success" | "denied" | "error" | "timeout";

export interface GeolocationState {
  status: GeolocationStatus;
  lat: number | null;
  lng: number | null;
  /** Accuracy radius in meters, as reported by the browser. */
  accuracy: number | null;
  errorMessage: string | null;
}

const GEOLOCATION_TIMEOUT_MS = 10000;

const isGeolocationSupported = () =>
  typeof navigator !== "undefined" && !!navigator.geolocation;

const initialState = (): GeolocationState =>
  isGeolocationSupported()
    ? { status: "loading", lat: null, lng: null, accuracy: null, errorMessage: null }
    : {
        status: "error",
        lat: null,
        lng: null,
        accuracy: null,
        errorMessage: "Geolocation isn't supported in this browser.",
      };

/**
 * Wraps navigator.geolocation.getCurrentPosition with loading / denied /
 * timeout / error states and a retry() action. Requires a secure context
 * (HTTPS) or localhost — browsers block Geolocation on plain HTTP.
 */
export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>(initialState);

  // Guards against a late callback firing after a newer request started.
  const requestIdRef = useRef(0);

  // Fetches a fresh position. Only ever called from a retry handler or from
  // the mount effect below — the browser API itself is asynchronous, so the
  // setState calls inside its callbacks never run synchronously within an
  // effect body.
  const fetchLocation = useCallback(() => {
    if (!isGeolocationSupported()) return;

    const thisRequestId = ++requestIdRef.current;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (requestIdRef.current !== thisRequestId) return;
        setState({
          status: "success",
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          errorMessage: null,
        });
      },
      (err) => {
        if (requestIdRef.current !== thisRequestId) return;

        if (err.code === err.PERMISSION_DENIED) {
          setState({
            status: "denied",
            lat: null,
            lng: null,
            accuracy: null,
            errorMessage:
              "Location access was blocked. Please allow location permission for this site in your browser settings, then retry.",
          });
        } else if (err.code === err.TIMEOUT) {
          setState({
            status: "timeout",
            lat: null,
            lng: null,
            accuracy: null,
            errorMessage: "Getting your GPS fix took too long. Move to an open area and retry.",
          });
        } else {
          setState({
            status: "error",
            lat: null,
            lng: null,
            accuracy: null,
            errorMessage: "Couldn't determine your location. Please retry.",
          });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: GEOLOCATION_TIMEOUT_MS,
        maximumAge: 0,
      }
    );
  }, []);

  /** Public retry/refresh action: marks state as loading, then re-fetches. */
  const requestLocation = useCallback(() => {
    if (!isGeolocationSupported()) return;
    setState((prev) => ({ ...prev, status: "loading", errorMessage: null }));
    fetchLocation();
  }, [fetchLocation]);

  // Kick off automatically on mount (skipped entirely if unsupported, since
  // initialState() already reflects that case).
  useEffect(() => {
    if (isGeolocationSupported()) {
      fetchLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...state, retry: requestLocation };
}
