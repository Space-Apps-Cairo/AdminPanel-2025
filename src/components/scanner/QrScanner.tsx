"use client";

import { Html5Qrcode } from "html5-qrcode";
import React, { useEffect, useRef, useCallback, useState, useId } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Camera, RotateCcw, SwitchCamera } from "lucide-react";
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
  const [isStarted, setIsStarted] = useState(false);
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);

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

  const switchCamera = useCallback(async () => {
    if (
      scannerRef.current &&
      scannerRef.current.isScanning &&
      cameras.length > 1 &&
      selectedCameraId
    ) {
      setIsLoading(true);
      try {
        await scannerRef.current.stop(); // Stop scanning

        const currentIndex = cameras.findIndex((c) => c.id === selectedCameraId);
        const nextIndex = (currentIndex + 1) % cameras.length;
        const nextCameraId = cameras[nextIndex].id;
        setSelectedCameraId(nextCameraId);

        // Restart with the new camera
        await scannerRef.current.start(
          { deviceId: { exact: nextCameraId } },
          {
            fps: 5,
            qrbox: { width: 288, height: 288 },
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
          },
        );
      } catch (err) {
        console.error("Error switching camera:", err);
        onError("Failed to switch camera.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [
    cameras,
    selectedCameraId,
    onScanSuccess,
    onError,
    turnOffTorchAndStop,
  ]);

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
      const cameraList = await Html5Qrcode.getCameras();
      if (!cameraList.length) throw new Error("No camera found");

      setCameras(cameraList);

      const rearCamera = cameraList.find((camera) =>
        camera.label.toLowerCase().includes("back"),
      );
      const cameraId = rearCamera ? rearCamera.id : cameraList[0].id;
      setSelectedCameraId(cameraId);

      await scannerRef.current.start(
        { deviceId: { exact: cameraId } },
        {
          fps: 5,
          qrbox: { width: 288, height: 288 },
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
    // This effect now only handles cleanup when the component unmounts.
    return () => {
      turnOffTorchAndStop();
    };
  }, [turnOffTorchAndStop]);

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

  if (!isStarted) {
    return (
      <React.Fragment>
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center space-y-4">
              <Camera className="w-16 h-16 mx-auto text-gray-400" />
              <h3 className="text-lg font-semibold">Ready to Scan</h3>
              <p className="text-gray-600">
                The app needs camera access to scan QR codes.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setIsStarted(true);
                    startScanner();
                  }}
                  className="flex-1"
                >
                  Start Scanning
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
      <style>{`
        #${previewId} video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }
        #${previewId} > div {
          border: none !important;
        }
        @keyframes scan-line {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .scanning-line {
          position: absolute;
          left: 0;
          width: 100%;
          height: 2px;
          background: #00ff00;
          filter: drop-shadow(0 0 10px #00ff00);
          animation: scan-line 2s linear infinite;
        }
      `}</style>
      <div className="fixed inset-0 bg-black z-50">
        <div className="relative w-full h-full">
          <div id={previewId} className="w-full h-full" />

          {/* Scanning Box Overlay */}
          {!isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-72 h-72 relative"
                style={{
                  boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
                }}
              >
                <div className="absolute -top-px -left-px w-10 h-10 border-t-4 border-l-4 border-green-500 rounded-tl-lg"></div>
                <div className="absolute -top-px -right-px w-10 h-10 border-t-4 border-r-4 border-green-500 rounded-tr-lg"></div>
                <div className="absolute -bottom-px -left-px w-10 h-10 border-b-4 border-l-4 border-green-500 rounded-bl-lg"></div>
                <div className="absolute -bottom-px -right-px w-10 h-10 border-b-4 border-r-4 border-green-500 rounded-br-lg"></div>
                <div className="scanning-line"></div>
              </div>
            </div>
          )}

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
          {cameras.length > 1 && (
            <Button
              onClick={switchCamera}
              size="icon"
              variant="secondary"
              className="absolute top-4 left-4 z-10 rounded-full"
              disabled={isLoading}
            >
              <SwitchCamera className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
