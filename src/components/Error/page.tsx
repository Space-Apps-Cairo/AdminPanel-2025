
"use client";

import { useRouter } from "next/navigation";
import { Home, ArrowLeft } from "lucide-react";

interface ErrorProps {
  status: number | string;    
  message: string;            
  details?: string;               
}

export default function Error({ status, message, details }: ErrorProps) {
  const router = useRouter();

  const getColor = () => {
    if (+status === 404) return "text-blue-600";
    if (+status === 500) return "text-red-600";
    return "text-orange-500";
  };

  const getSubtitle = () => {
    if (+status === 404) return "The page you’re looking for doesn’t exist.";
    if (+status === 500) return "Something went wrong on our servers.";
    return "An unexpected error has occurred.";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* Status Code */}
      <h1 className={`text-7xl font-extrabold mb-4 ${getColor()}`}>{status}</h1>

      {/* Sub title */}
      <p className="text-md text-gray-500 mb-2">{getSubtitle()}</p>

      {/* Error Message */}
      <p className="text-lg text-gray-800 font-medium mb-4 max-w-md">{message}</p>

      {/* Extra Details */}
      {details && (
        <pre className="bg-gray-100 text-gray-700 p-3 rounded-lg text-sm mb-6 max-w-xl overflow-auto">
          {details}
        </pre>
      )}

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-5 py-2 rounded-lg shadow bg-gray-600 text-white hover:bg-gray-700 transition"
        >
          <ArrowLeft size={18} /> Go Back
        </button>

        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 px-5 py-2 rounded-lg shadow bg-red-600 text-white hover:bg-red-700 transition"
        >
          <Home size={18} /> Go Home
        </button>
      </div>
    </div>
  );
}
