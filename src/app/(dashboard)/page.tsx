import { Clock } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
      {/* Icon */}
      <div className="p-6 bg-blue-100 dark:bg-blue-900 rounded-full shadow-lg">
        <Clock className="size-20 text-blue-600 dark:text-blue-400" />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
        Coming Soon
      </h1>

      {/* Subtitle */}
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md">
        You can explore the other pages freely.
      </p>
    </div>
  );
}
