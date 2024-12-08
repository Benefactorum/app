import { AlertCircle } from "lucide-react";

export function InputError({ children }) {
  return (
    <div className="flex items-center text-red-600 text-sm p-1">
      <AlertCircle className="w-4 h-4 mr-1" />
      {children}
    </div>
  );
}
