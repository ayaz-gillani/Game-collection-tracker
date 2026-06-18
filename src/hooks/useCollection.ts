"use client";

import { useContext } from "react";
import { CollectionContext } from "@/context/CollectionContext";

/**
 * Custom hook to access collection state and actions
 * Must be used within CollectionProvider
 */
export function useCollection() {
  const context = useContext(CollectionContext);

  if (!context) {
    throw new Error("useCollection must be used within CollectionProvider");
  }

  return context;
}
