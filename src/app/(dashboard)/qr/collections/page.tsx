"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, QrCode, User, Package, Users, Settings } from "lucide-react";

import {
  useGetAllCollectionsQuery,
  useAssignCollectionMutation,
} from "@/service/Api/material/materials";
import { Collection } from "@/types/material/materials";
import Loading from "@/components/loading/loading";
import Link from "next/link";
import { useAppSelector } from "@/service/store/store";
import { UserRole } from "@/types/auth.types";

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

export default function CollectionsPage() {
  const [showScanner, setShowScanner] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  // Get user role from Redux store
  const userRole = useAppSelector((state) => state.auth.role) as UserRole;

  // Only Admin and material roles can access collections
  const canAccessCollections = userRole === 'Admin' || userRole === 'material';

  const { data: collectionsData, isLoading: isLoadingCollections } =
    useGetAllCollectionsQuery(undefined, {
      skip: !canAccessCollections
    });

  const [assignCollection] = useAssignCollectionMutation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleScanSuccess = async (scannedData: string) => {
    if (!selectedCollection) return;

    const participantUuid = String(scannedData).trim();

    try {
      const result = await assignCollection({
        user_id: participantUuid,
        collection_id: selectedCollection.id,
      }).unwrap();
      
      toast.success(
        result.success ? "Assigned successfully" : "Assignment completed",
        {
          description:
            result.msg ||
            `Allowed: ${result.data?.allowed}, Current: ${result.data?.current_quantity}`,
        }
      );
    } catch (err: unknown) {
      const apiErr = err as { data?: { msg?: string; message?: string } };
      const errorMessage =
        apiErr?.data?.msg || apiErr?.data?.message || `An error occurred.`;

      toast.error("Collection Assignment Failed", {
        description: errorMessage,
      });
    }
  };

  const handleScanError = (errorMessage: string) => {
    setShowScanner(false);
    toast.error("Scan error", {
      description: errorMessage,
    });
  };

  const openScanner = (collection: Collection) => {
    setSelectedCollection(collection);
    setShowScanner(true);
  };

  const closeScanner = () => {
    setShowScanner(false);
    setSelectedCollection(null);
  };

  if (!canAccessCollections) {
    return (
      <div className="space-y-6 py-8 px-8">
        <h1 className="text-3xl font-bold mb-8">Collections</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to access collections.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingCollections) {
    return <Loading />;
  }

  const collections = collectionsData?.data ?? [];

  return (
    <div className="space-y-6 py-8 px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Collections</h1>
          <p className="text-muted-foreground">
            Manage and assign material collections to participants
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Package className="h-4 w-4" />
          <span>{collections.length} Collections</span>
        </div>
      </div>

      {collections.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Collections Found</h2>
            <p className="text-muted-foreground">
              There are no collections available at the moment.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection, idx) => (
            <Card key={collection.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Collection {idx + 1}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {collection.collection_name}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-muted-foreground">
                      {collection.used_quantity}/{collection.total_quantity}
                    </span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(collection.used_quantity / collection.total_quantity) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>Total: {collection.total_quantity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Max/User: {collection.max_per_user}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Materials:</span>
                  </div>
                  <div className="pl-6">
                    <p className="text-sm text-muted-foreground">
                      {collection.materials.length > 0
                        ? collection.materials.map((m) => m.material_name).join(", ")
                        : "No materials assigned"}
                    </p>
                  </div>
                </div>

                {collection.total_quantity === collection.used_quantity && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800 font-medium">
                      ⚠️ Collection is fully utilized
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="grid grid-cols-2 gap-2 max-[450px]:grid-cols-1">
                <Button
                  onClick={() => openScanner(collection)}
                  disabled={collection.total_quantity === collection.used_quantity}
                  className="w-full"
                >
                  <QrCode className="mr-2 h-4 w-4" /> 
                  Scan
                </Button>
                <Link
                  className="w-full"
                  href={`/materials/collections/${collection.id}`}
                >
                  <Button className="w-full" variant="outline">
                    <User className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Registrants</span>
                    <span className="sm:hidden">Users</span>
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {isClient && showScanner && selectedCollection && (
        <QrScanner
          onScanSuccess={handleScanSuccess}
          onError={handleScanError}
          onClose={closeScanner}
        />
      )}
    </div>
  );
}
