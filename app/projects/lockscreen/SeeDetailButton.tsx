"use client";

import React from "react";
import { useSeeDetail } from "./SeeDetailContext";

export default function SeeDetailButton({ className = "" }: { className?: string }) {
  const { open } = useSeeDetail();

  return (
    <button onClick={open} className={`lsx-btn ${className}`}>
      See detail
    </button>
  );
}
