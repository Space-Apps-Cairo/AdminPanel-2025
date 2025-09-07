"use client";

import { Html5Qrcode } from "html5-qrcode";
import React, { useEffect, useRef, useCallback, useState, useId } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Camera, RotateCcw } from "lucide-react";
import { ScannerProps } from "@/types/scanner";

type TorchConstraints = MediaTrackConstraints & {
  advanced?: Array<{ torch?: boolean }>;
};
type TorchTrack = MediaStreamTrack & {
  applyConstraints?: (constraints: TorchConstraints) => Promise<void>;
};

export default function QrScanner({
  onScanSuccess,
  onError,
  onClose,
}: ScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const id = useId();
  const previewId = `qr-preview-${id}`;

  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const turnOffTorchAndStop = useCallback(async () => {
    try {
      const videoEl = document.querySelector(
        `#${previewId} video`
      ) as HTMLVideoElement | null;
      const stream = (videoEl?.srcObject as MediaStream | null) || null;
      const track = stream?.getVideoTracks()?.[0] as TorchTrack | undefined;

      try {
        await track?.applyConstraints?.({ advanced: [{ torch: false }] });
      } catch {
        // device may not support torch
      }

      if (scannerRef.current?.isScanning) {
        await scannerRef.current.stop();
      }
      await scannerRef.current?.clear?.();

      stream?.getTracks().forEach((t) => t.stop());
    } catch (err) {
      console.error("Error during stop/torch-off:", err);
    }
  }, [previewId]);

  const stopScanner = useCallback(async () => {
    try {
      await turnOffTorchAndStop();
    } catch (err) {
      console.error("Error stopping scanner:", err);
    } finally {
      scannerRef.current = null;
      onClose();
    }
  }, [onClose, turnOffTorchAndStop]);

  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      setHasPermission(true);
      return true;
    } catch (err) {
      setHasPermission(false);
      console.log(err);
      onError("Permission to access the camera has been denied.");
      return false;
    }
  }, [onError]);

  const startScanner = useCallback(async () => {
    try {
      setIsLoading(true);
      const ok = await requestPermission();
      if (!ok) return;

      const el = document.getElementById(previewId);
      if (!el) {
        console.error("Preview element not found");
        return;
      }

      scannerRef.current = new Html5Qrcode(previewId);
      const cameras = await Html5Qrcode.getCameras();
      if (!cameras.length) throw new Error("No camera found");

      await scannerRef.current.start(
        { deviceId: { exact: cameras[0].id } },
        {
          fps: 5,
        },
        async (decodedText) => {
          await turnOffTorchAndStop();
          onScanSuccess(decodedText);
        },
        (errorMessage) => {
          if (
            !errorMessage.includes("No QR code found") &&
            !errorMessage.includes("NotFoundException")
          ) {
            console.warn("Scan error:", errorMessage);
          }
        }
      );

      setIsLoading(false);
    } catch (err) {
      console.error("Error starting scanner:", err);
      setIsLoading(false);
      onError("An error occurred while starting the scanner.");
    }
  }, [
    onScanSuccess,
    onError,
    requestPermission,
    previewId,
    turnOffTorchAndStop,
  ]);

  useEffect(() => {
    let active = true;
    const init = async () => {
      await new Promise((r) => setTimeout(r, 500));
      if (active) startScanner();
    };
    init();

    return () => {
      active = false;
      turnOffTorchAndStop();
    };
  }, [startScanner, turnOffTorchAndStop]);

  if (hasPermission === false) {
    return (
      <React.Fragment>
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center space-y-4">
              <Camera className="w-16 h-16 mx-auto text-gray-400" />
              <h3 className="text-lg font-semibold">
                Camera permission required
              </h3>
              <p className="text-gray-600">
                The app needs camera access to scan QR.
              </p>
              <div className="flex gap-2">
                <Button onClick={startScanner} className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try again
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className="fixed inset-0 bg-black z-50">
        <div className="relative w-full h-full">
          <div id={previewId} className="w-full h-full" />

          {isLoading && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="text-white text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto" />
                <p className="text-lg">Camera is running...</p>
              </div>
            </div>
          )}

          <Button
            onClick={stopScanner}
            size="icon"
            variant="secondary"
            className="absolute top-4 right-4 z-10 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
}
