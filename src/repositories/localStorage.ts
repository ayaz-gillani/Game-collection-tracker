import type { Collection, CollectionItem } from "@/types";
import type { ICollectionRepository } from "./types";

const STORAGE_KEY = "game-collection";
const ARTIFICIAL_DELAY = 300; // milliseconds

/**
 * localStorage-based implementation of ICollectionRepository
 *
 * Cross-Tab Synchronization Strategy:
 * - Uses native `storage` event listener for cross-tab communication
 * - When Tab A modifies localStorage, other tabs receive a `storage` event on `window`
 * - NOTE: Storage events do NOT fire on the tab that made the change (preventing double-updates)
 * - Strategy: Reload entire collection from localStorage on storage event (acceptable for ~15 games)
 *
 * Tradeoffs:
 * ✓ Pro: Zero CPU overhead, fires instantly, no polling
 * ✗ Con: Full collection reload instead of targeted updates (acceptable for small dataset)
 * ✗ Con: Requires localStorage to be actively used (not suitable for multi-server scenarios)
 */
export class LocalStorageCollectionRepository implements ICollectionRepository {
  private listeners: Set<(collection: Collection) => void> = new Set();

  constructor() {
    this.setupStorageListener();
  }

  /**
   * Add artificial delay to simulate network latency
   */
  private async delay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ARTIFICIAL_DELAY));
  }

  /**
   * Get collection from localStorage, with error handling for corrupted data
   */
  private getStoredCollection(): Collection {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return {};
      return JSON.parse(data) as Collection;
    } catch (error) {
      console.error("Failed to parse collection from localStorage:", error);
      // Return empty collection on parse error; optionally notify user
      return {};
    }
  }

  /**
   * Save collection to localStorage with quota error handling
   */
  private saveCollection(collection: Collection): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
    } catch (error) {
      if (error instanceof Error && error.name === "QuotaExceededError") {
        throw new Error("Storage quota exceeded. Please remove some games.");
      }
      throw error;
    }
  }

  /**
   * Setup cross-tab synchronization listener
   * Fires when localStorage is modified in other tabs
   */
  private setupStorageListener(): void {
    if (typeof window === "undefined") return; // Skip if running on server

    window.addEventListener("storage", (event: StorageEvent) => {
      // Only handle changes to our collection key
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const updatedCollection = JSON.parse(event.newValue) as Collection;
          // Notify all listeners of the change
          this.listeners.forEach((callback) => callback(updatedCollection));
        } catch (error) {
          console.error("Failed to parse storage event data:", error);
        }
      }
    });
  }

  async getCollection(): Promise<Collection> {
    await this.delay();
    return this.getStoredCollection();
  }

  async addGame(gameId: string, item: CollectionItem): Promise<void> {
    await this.delay();
    const collection = this.getStoredCollection();
    collection[gameId] = item;
    this.saveCollection(collection);
  }

  async updateGame(
    gameId: string,
    updates: Partial<CollectionItem>,
  ): Promise<void> {
    await this.delay();
    const collection = this.getStoredCollection();
    if (!collection[gameId]) {
      throw new Error(`Game ${gameId} not found in collection`);
    }
    collection[gameId] = { ...collection[gameId], ...updates };
    this.saveCollection(collection);
  }

  async removeGame(gameId: string): Promise<void> {
    await this.delay();
    const collection = this.getStoredCollection();
    collection[gameId].isactive = false; // Soft delete to preserve history
    this.saveCollection(collection);
  }

  async clearCollection(): Promise<void> {
    await this.delay();
    localStorage.removeItem(STORAGE_KEY);
  }

  subscribeToChanges(callback: (collection: Collection) => void): () => void {
    this.listeners.add(callback);
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }
}

// Export singleton instance
export const collectionRepository = new LocalStorageCollectionRepository();
