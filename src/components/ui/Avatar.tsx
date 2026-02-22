"use client";

import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  imageUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({ name, imageUrl, size = "md", className }: AvatarProps) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
    xl: "w-20 h-20 text-xl",
  };

  const colors = [
    "bg-primary-500",
    "bg-accent-500",
    "bg-sport-green",
    "bg-sport-orange",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-teal-500",
  ];

  // Generate a consistent color based on the name
  const colorIndex = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={cn(
          "rounded-full object-cover",
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center text-white font-semibold",
        sizes[size],
        colors[colorIndex],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
