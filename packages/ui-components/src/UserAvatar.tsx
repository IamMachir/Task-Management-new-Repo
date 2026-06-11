"use client";
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { cn } from "./utils";

const COLORS = [
  "bg-violet-500", "bg-indigo-500", "bg-blue-500", "bg-cyan-500",
  "bg-teal-500", "bg-emerald-500", "bg-rose-500", "bg-orange-500",
];

function getColorFromName(name: string): string {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return COLORS[sum % COLORS.length];
}

function getInitials(name: string): string {
  return name.trim().split(/\s+/).map((w) => w[0]?.toUpperCase() ?? "").slice(0, 2).join("");
}

export interface UserAvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showTooltip?: boolean;
}

const SIZE_MAP = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-12 h-12 text-base" };

export function UserAvatar({ name, src, size = "md", className, showTooltip }: UserAvatarProps) {
  const colorClass = getColorFromName(name);
  return (
    <div
      className={cn("relative rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white overflow-hidden", SIZE_MAP[size], !src && colorClass, className)}
      title={showTooltip ? name : undefined}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        getInitials(name)
      )}
    </div>
  );
}

export interface AvatarGroupProps {
  users: { name: string; src?: string }[];
  max?: number;
  size?: "sm" | "md" | "lg";
}

export function AvatarGroup({ users, max = 3, size = "sm" }: AvatarGroupProps) {
  const visible = users.slice(0, max);
  const overflow = users.length - max;
  return (
    <div className="flex -space-x-2">
      {visible.map((u) => (
        <UserAvatar key={u.name} name={u.name} src={u.src} size={size} showTooltip />
      ))}
      {overflow > 0 && (
        <div className={cn("rounded-full bg-slate-200 text-slate-600 flex items-center justify-center ring-2 ring-white font-medium", SIZE_MAP[size])}>
          +{overflow}
        </div>
      )}
    </div>
  );
}
