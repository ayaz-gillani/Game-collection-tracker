"use client";

import { useState, useMemo } from "react";
import { useCollection } from "@/hooks/useCollection";
import { Navigation } from "@/components/Navigation/Navigation";
import { CollectionCard } from "@/components/CollectionCard/CollectionCard";
import { FilterBar } from "@/components/FilterBar/FilterBar";
import { GameStatus } from "@/types";
import { gamesData } from "@/fixtures/games";
import styles from "./page.module.css";

type SortOption = "title" | "rating" | "dateAdded";

export default function CollectionPage() {
  const { state, removeGame, updateGameStatus, updateGameRating } =
    useCollection();
  const { collection } = state;

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("dateAdded");

  // Get games in collection
  const collectionGames = useMemo(() => {
    return Object.values(collection)
      .map((item) => {
        const game = gamesData.find((g) => {
          return g.id === item.gameId && item.isactive; // Only include if game is active in catalog
        });
        return game ? { game, item } : null;
      })
      .filter((entry) => entry !== null) as Array<{
      game: (typeof gamesData)[0];
      item: (typeof collection)[string];
    }>;
  }, [collection]);

  // Filter by genre
  const filteredGames = useMemo(() => {
    if (selectedGenres.length === 0) {
      return collectionGames;
    }
    return collectionGames.filter((entry) =>
      selectedGenres.includes(entry.game.genre),
    );
  }, [collectionGames, selectedGenres]);

  // Sort
  const sortedGames = useMemo(() => {
    const sorted = [...filteredGames];
    switch (sortBy) {
      case "title":
        return sorted.sort((a, b) => a.game.title.localeCompare(b.game.title));
      case "rating":
        return sorted.sort((a, b) => {
          const ratingA = a.item.rating ?? 0;
          const ratingB = b.item.rating ?? 0;
          return ratingB - ratingA;
        });
      case "dateAdded":
        return sorted.sort((a, b) => b.item.dateAdded - a.item.dateAdded);
    }
  }, [filteredGames, sortBy]);

  const isEmpty = collectionGames.length === 0;

  return (
    <div>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>My Collection</h1>
          <p className={styles.subtitle}>
            {isEmpty
              ? "No games yet. Add some from the catalog!"
              : `You have ${collectionGames.length} game${collectionGames.length !== 1 ? "s" : ""}`}
          </p>

          {!isEmpty && (
            <>
              <FilterBar
                selectedGenres={selectedGenres}
                onGenreChange={setSelectedGenres}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />

              {sortedGames.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No games match your filters</p>
                </div>
              ) : (
                <div className={styles.list}>
                  {sortedGames.map(({ game, item }) => (
                    <CollectionCard
                      key={game.id}
                      game={game}
                      collectionItem={item}
                      onStatusChange={(status) =>
                        updateGameStatus(game.id, status)
                      }
                      onRatingChange={(rating) =>
                        updateGameRating(game.id, rating)
                      }
                      onRemove={() => removeGame(game.id)}
                      loading={state.loading}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
