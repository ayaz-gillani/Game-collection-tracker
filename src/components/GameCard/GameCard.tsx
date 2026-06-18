"use client";

import { GameStatus } from "@/types";
import { StatusBadge } from "@/components/StatusBadge/StatusBadge";
import { StarRating } from "@/components/StarRating/StarRating";
import type { Game, CollectionItem } from "@/types";
import { useState } from "react";
import styles from "./GameCard.module.css";

interface GameCardProps {
  game: Game;
  isInCollection: boolean;
  collectionItem?: CollectionItem;
  onAddClick: () => Promise<void>;
  loading?: boolean;
}

export function GameCard({
  game,
  isInCollection,
  collectionItem,
  onAddClick,
  loading = false,
}: GameCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const handleAddClick = async () => {
    setIsAdding(true);
    try {
      await onAddClick();
      setIsAdding(false);
    } catch (error) {
      setIsAdding(false);
      console.error("Error adding game:", error);
    }
  };

  const platformDisplay = game.platform.join(", ");

  return (
    <div className={styles.card}>
      <img src={game.coverUrl} alt={game.title} className={styles.cover} />

      <div className={styles.content}>
        <h3 className={styles.title}>{game.title}</h3>

        <div className={styles.meta}>
          <span className={styles.genre}>{game.genre}</span>
          <span className={styles.year}>{game.releaseYear}</span>
        </div>

        <div className={styles.platforms}>{platformDisplay}</div>

        {isInCollection && collectionItem && (
          <div className={styles.collectionInfo}>
            <StatusBadge status={collectionItem.status} />
            {collectionItem.status === GameStatus.Completed &&
              collectionItem.rating && (
                <div className={styles.rating}>
                  <StarRating
                    rating={collectionItem.rating}
                    onRatingChange={() => {}}
                    disabled
                  />
                </div>
              )}
          </div>
        )}

        <button
          className={`${styles.button} ${isInCollection ? styles.added : ""}`}
          onClick={handleAddClick}
          disabled={isInCollection || isAdding}
        >
          {isAdding
            ? "Adding..."
            : isInCollection
              ? "Added ✓"
              : "Add to Collection"}
        </button>
      </div>
    </div>
  );
}
