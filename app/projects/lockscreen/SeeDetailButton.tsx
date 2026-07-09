"use client";

import React from "react";
import { useSeeDetail } from "./SeeDetailContext";

export default function SeeDetailButton({
  className = "",
  label = "See detail",
}: {
  className?: string;
  label?: string;
}) {
  const { open } = useSeeDetail();

  return (
    <button onClick={open} className={`lsx-btn ${className}`}>
      {label}
    </button>
  );
}
