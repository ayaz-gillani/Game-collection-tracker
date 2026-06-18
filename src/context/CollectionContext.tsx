"use client";

import {
  createContext,
  useCallback,
  useReducer,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import { collectionRepository } from "@/repositories";
import { useCollectionSync } from "@/hooks/useCollectionSync";
import type {
  Collection,
  CollectionState,
  CollectionAction,
  GameStatus,
  CollectionItem,
} from "@/types";

/**
 * Collection context
 */
export const CollectionContext = createContext<{
  state: CollectionState;
  addGame: (
    gameId: string,
    status: GameStatus,
    rating: number | null,
  ) => Promise<void>;
  removeGame: (gameId: string) => Promise<void>;
  updateGameStatus: (gameId: string, status: GameStatus) => Promise<void>;
  updateGameRating: (gameId: string, rating: number | null) => Promise<void>;
} | null>(null);

/**
 * Reducer for collection state management
 */
function collectionReducer(
  state: CollectionState,
  action: CollectionAction,
): CollectionState {
  switch (action.type) {
    case "SET_COLLECTION":
      return { ...state, collection: action.payload };
    case "ADD_GAME":
      return {
        ...state,
        collection: {
          ...state.collection,
          [action.payload.gameId]: {
            ...action.payload,
            // status: action.payload.status,
            isactive: true,
          },
        },
      };
    case "REMOVE_GAME":
      // const { [action.payload]: _, ...remaining } = state.collection;
      console.log(
        "Removing game from collection:",
        state.collection[action.payload],
      );
      if (!state.collection[action.payload]) {
        return state;
      }

      return {
        ...state,
        collection: {
          ...state.collection,
          [action.payload]: {
            ...state.collection[action.payload],
            isactive: false,
          },
        },
      };
    case "UPDATE_GAME": {
      const { gameId, updates } = action.payload;
      return {
        ...state,
        collection: {
          ...state.collection,
          [gameId]: {
            ...state.collection[gameId],
            ...updates,
          },
        },
      };
    }
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

const initialState: CollectionState = {
  collection: {},
  loading: true,
  error: null,
};

/**
 * Provider component for collection state
 */
export function CollectionProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const [state, dispatch] = useReducer(collectionReducer, initialState);
  const isInitializedRef = useRef(false);

  // Initialize collection from repository on mount
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const initializeCollection = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const collection = await collectionRepository.getCollection();
        dispatch({ type: "SET_COLLECTION", payload: collection });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load collection";
        dispatch({ type: "SET_ERROR", payload: message });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initializeCollection();
  }, []);

  // Setup cross-tab synchronization
  const handleCollectionChange = useCallback((collection: Collection) => {
    dispatch({ type: "SET_COLLECTION", payload: collection });
  }, []);

  useCollectionSync(handleCollectionChange);

  // Action handlers
  const addGame = useCallback(
    async (gameId: string, status: GameStatus, rating: number | null) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });
        const item: CollectionItem = {
          gameId,
          status,
          rating,
          dateAdded: Date.now(),
          isactive: true,
        };
        await collectionRepository.addGame(gameId, item);
        dispatch({ type: "ADD_GAME", payload: item });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to add game";
        dispatch({ type: "SET_ERROR", payload: message });
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [],
  );

  const removeGame = useCallback(async (gameId: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      await collectionRepository.removeGame(gameId);
      dispatch({ type: "REMOVE_GAME", payload: gameId });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to remove game";
      dispatch({ type: "SET_ERROR", payload: message });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const updateGameStatus = useCallback(
    async (gameId: string, status: GameStatus) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });
        await collectionRepository.updateGame(gameId, { status });
        dispatch({
          type: "UPDATE_GAME",
          payload: { gameId, updates: { status } },
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to update game status";
        dispatch({ type: "SET_ERROR", payload: message });
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [],
  );

  const updateGameRating = useCallback(
    async (gameId: string, rating: number | null) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });
        await collectionRepository.updateGame(gameId, { rating });
        dispatch({
          type: "UPDATE_GAME",
          payload: { gameId, updates: { rating } },
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to update rating";
        dispatch({ type: "SET_ERROR", payload: message });
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [],
  );

  const contextValue = {
    state,
    addGame,
    removeGame,
    updateGameStatus,
    updateGameRating,
  };

  return (
    <CollectionContext.Provider value={contextValue}>
      {children}
    </CollectionContext.Provider>
  );
}
