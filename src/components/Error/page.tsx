

"use client";

import { useRouter } from "next/navigation";

interface ErrorProps {
  status?: number | string;
  message?: string;
}

export default function Error({ status = 404, message = "Page not found" }: ErrorProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-red-600 mb-4">{status}</h1>
      <p className="text-lg text-gray-600 mb-6">{message}</p>
      <button
        onClick={() => router.back()}
        className="px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
      >
        Go Back
      </button>
    </div>
  );
}
