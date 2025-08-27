"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const QrScanner = dynamic(() => import("@/components/scanner/QrScanner"), {
    ssr: false,
    loading: () => (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="flex flex-col items-center space-y-4">
                <Skeleton className="h-64 w-64 rounded-xl bg-gray-700" />
                <div className="text-white text-xl">Loading scanner...</div>
            </div>
        </div>
    ),
});

export default function ScanQrCode() {

    const [showScanner, setShowScanner] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const { toast } = useToast();

    useEffect(() => setIsClient(true), []);

    return <React.Fragment>

        <Button onClick={() => setShowScanner(true)}>Scan QR Code</Button>

        {isClient && showScanner && (
            <QrScanner
                onScanSuccess={(res) => {
                    setShowScanner(false);
                    toast({
                        title: "QR code read",
                        description: res,
                    });
                }}
                onError={(msg) => {
                    setShowScanner(false);
                    toast({
                        title: "Scan error",
                        description: msg,
                        variant: "destructive",
                    });
                }}
                onClose={() => setShowScanner(false)}
            />
        )}

    </React.Fragment>

}
