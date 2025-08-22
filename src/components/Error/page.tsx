"use client";

import { useRouter } from "next/navigation";

export default function Error() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-6">Page not found</p>
      <button
        onClick={() => router.back()}
        className="px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
      >
        Go Back
      </button>
    </div>
  );
}

