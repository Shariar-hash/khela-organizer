"use client";

import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useState } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "relative w-full bg-white shadow-2xl",
          "animate-in fade-in zoom-in-95 duration-200",
          "rounded-t-2xl sm:rounded-2xl",
          "max-h-[90vh] overflow-y-auto",
          sizes[size]
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-4 sm:px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
