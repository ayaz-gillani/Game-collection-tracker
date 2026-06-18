/**
 * Core type definitions for the Game Collection Tracker application
 */

/**
 * Enum for game status in the user's collection
 */
export enum GameStatus {
  NotStarted = "NotStarted",
  InProgress = "InProgress",
  Completed = "Completed",
}

/**
 * Enum for game genres
 */
export enum GameGenre {
  Action = "Action",
  Adventure = "Adventure",
  RPG = "RPG",
  Strategy = "Strategy",
  Puzzle = "Puzzle",
  Sports = "Sports",
  Simulation = "Simulation",
}

/**
 * Represents a game in the catalog
 */
export interface Game {
  id: string;
  title: string;
  genre: GameGenre;
  releaseYear: number;
  platform: string[];
  coverUrl: string;
  description?: string;
  isactive: boolean; // Indicates if the game is active in the catalog
}

/**
 * Represents a game in the user's collection
 * Tracks status, rating, and timestamps for restore logic
 */
export interface CollectionItem {
  gameId: string;
  status: GameStatus;
  rating: number | null; // 1-5 or null
  dateAdded: number; // timestamp
  dateRemoved?: number; // timestamp, for restore logic
  isactive: boolean; // Indicates if the game is active in the collection
}

/**
 * Collection is a map of gameId -> CollectionItem
 */
export type Collection = Record<string, CollectionItem>;

/**
 * Represents the state of the collection in the context
 */
export interface CollectionState {
  collection: Collection;
  loading: boolean;
  error: string | null;
}

/**
 * Union type for collection context actions
 */
export type CollectionAction =
  | { type: "SET_COLLECTION"; payload: Collection }
  | { type: "ADD_GAME"; payload: CollectionItem }
  | { type: "REMOVE_GAME"; payload: string } // gameId
  | {
      type: "UPDATE_GAME";
      payload: { gameId: string; updates: Partial<CollectionItem> };
    }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };
