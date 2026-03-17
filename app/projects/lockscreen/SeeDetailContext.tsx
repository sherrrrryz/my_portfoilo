"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import SeeDetailModal from "./SeeDetailModal";

const SeeDetailContext = createContext<{ open: () => void }>({ open: () => {} });

export function useSeeDetail() {
  return useContext(SeeDetailContext);
}

export function SeeDetailProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);

  return (
    <SeeDetailContext.Provider value={{ open }}>
      {children}
      <SeeDetailModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </SeeDetailContext.Provider>
  );
}
