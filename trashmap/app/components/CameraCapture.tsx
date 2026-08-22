"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, RotateCcw, AlertTriangle, X } from "lucide-react";

interface CameraCaptureProps {
  /** Called with a data URL (image/jpeg) once the user confirms a captured photo. */
  onCapture: (dataUrl: string) => void;
  /** Optional: called when the user retakes / clears an existing capture. */
  onRetake?: () => void;
  /** Existing captured image (data URL), if the parent already has one. */
  capturedImageUrl?: string | null;
}

type CameraState = "idle" | "starting" | "live" | "captured" | "error";

/**
 * Live-camera-only capture widget. Anti-fraud requirement: no gallery/file
 * upload input is ever rendered — the only way to produce a photo is via
 * getUserMedia + canvas snapshot.
 */
export default function CameraCapture({
  onCapture,
  onRetake,
  capturedImageUrl,
}: CameraCaptureProps) {
  const [state, setState] = useState<CameraState>(capturedImageUrl ? "captured" : "idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localCapture, setLocalCapture] = useState<string | null>(capturedImageUrl ?? null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async () => {
    setErrorMessage(null);
    setState("starting");

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setErrorMessage(
        "Camera access isn't supported in this browser. Try Chrome, Safari, Firefox, or Edge over HTTPS."
      );
      setState("error");
      return;
    }

    try {
      // Prefer rear camera on mobile; falls back to any camera on desktop.
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });

      streamRef.current = stream;
      setState("live");

      // Attach on next tick so the <video> element is mounted.
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {
            /* autoplay races are harmless here */
          });
        }
      });
    } catch (err) {
      stopStream();
      const domErr = err as DOMException;
      if (domErr?.name === "NotAllowedError" || domErr?.name === "PermissionDeniedError") {
        setErrorMessage(
          "Camera access was blocked. Please allow camera permission for this site in your browser settings, then try again."
        );
      } else if (domErr?.name === "NotFoundError" || domErr?.name === "DevicesNotFoundError") {
        setErrorMessage("No camera was found on this device.");
      } else if (domErr?.name === "NotReadableError") {
        setErrorMessage("The camera is already in use by another application.");
      } else {
        setErrorMessage("Could not access the camera. Please check permissions and try again.");
      }
      setState("error");
    }
  }, [stopStream]);

  const handleCapturePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;

    const canvas = canvasRef.current ?? document.createElement("canvas");
    canvasRef.current = canvas;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setLocalCapture(dataUrl);
    setState("captured");
    stopStream();
  }, [stopStream]);

  const handleRetake = useCallback(() => {
    setLocalCapture(null);
    setState("idle");
    onRetake?.();
  }, [onRetake]);

  const handleConfirm = useCallback(() => {
    if (localCapture) onCapture(localCapture);
  }, [localCapture, onCapture]);

  // Clean up the media stream on unmount.
  useEffect(() => {
    return () => stopStream();
  }, [stopStream]);

  return (
    <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-slate-900 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-white">
      {/* Hidden canvas used purely for frame capture */}
      <canvas ref={canvasRef} className="hidden" />

      {state === "idle" && (
        <div className="text-center p-6 space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10 animate-pulse">
            <Camera className="w-7 h-7" />
          </div>
          <div>
            <p className="font-bold text-sm text-white">Take Live Photo on Location</p>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              Live camera capture embeds GPS coordinates and prevents fake reports.
            </p>
          </div>
          <button
            type="button"
            onClick={startCamera}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            📸 Open Camera & Snap Photo
          </button>
        </div>
      )}

      {state === "starting" && (
        <div className="text-center p-6 space-y-3">
          <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-300 font-semibold">Requesting camera access…</p>
        </div>
      )}

      {state === "error" && (
        <div className="text-center p-6 space-y-3 max-w-sm">
          <div className="w-12 h-12 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="text-xs text-red-300 font-semibold leading-relaxed">{errorMessage}</p>
          <button
            type="button"
            onClick={startCamera}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 font-bold text-xs rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {state === "live" && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            LIVE
          </div>
          <button
            type="button"
            onClick={() => {
              stopStream();
              setState("idle");
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition-colors"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleCapturePhoto}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white border-4 border-emerald-500 shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            title="Capture Photo"
            aria-label="Capture Photo"
          />
        </>
      )}

      {state === "captured" && localCapture && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={localCapture} alt="Captured litter" className="w-full h-full object-cover" />
          <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Preview — Not Yet Confirmed</span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleRetake}
              className="bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl backdrop-blur-xs transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Photo
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-xl shadow-md shadow-emerald-600/30 transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Use This Photo
            </button>
          </div>
        </>
      )}
    </div>
  );
}
