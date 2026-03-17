"use client";

import React from "react";
import { useSeeDetail } from "./SeeDetailContext";

export default function SeeDetailButton({ className = "" }: { className?: string }) {
  const { open } = useSeeDetail();

  return (
    <button
      onClick={open}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white font-semibold text-sm tracking-wider transition-opacity duration-200 hover:opacity-85 cursor-pointer ${className}`}
    >
      See Detail
    </button>
  );
}
