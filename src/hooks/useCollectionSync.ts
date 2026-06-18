import { useEffect } from "react";
import { collectionRepository } from "@/repositories";
import type { Collection } from "@/types";

/**
 * Hook that sets up cross-tab synchronization listener
 * Listens to storage events and triggers a callback when collection changes in other tabs
 */
export function useCollectionSync(
  onCollectionChange: (collection: Collection) => void,
): void {
  useEffect(() => {
    // Subscribe to storage changes from other tabs
    const unsubscribe =
      collectionRepository.subscribeToChanges(onCollectionChange);

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [onCollectionChange]);
}
