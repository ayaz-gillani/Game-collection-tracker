import type { Collection, CollectionItem } from "@/types";

/**
 * Repository interface for collection data persistence.
 * Abstracts storage logic to allow swapping localStorage with backend/API later.
 */
export interface ICollectionRepository {
  /**
   * Retrieve the entire collection
   */
  getCollection(): Promise<Collection>;

  /**
   * Add a game to the collection
   */
  addGame(gameId: string, item: CollectionItem): Promise<void>;

  /**
   * Update an existing game in the collection
   */
  updateGame(gameId: string, updates: Partial<CollectionItem>): Promise<void>;

  /**
   * Remove a game from the collection
   */
  removeGame(gameId: string): Promise<void>;

  /**
   * Clear the entire collection
   */
  clearCollection(): Promise<void>;

  /**
   * Subscribe to collection changes from other tabs/windows
   * Returns an unsubscribe function
   */
  subscribeToChanges(callback: (collection: Collection) => void): () => void;
}
