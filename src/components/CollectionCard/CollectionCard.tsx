"use client";

import { useState } from "react";
import { GameStatus } from "@/types";
import { StarRating } from "@/components/StarRating/StarRating";
import { StatusBadge } from "@/components/StatusBadge/StatusBadge";
import { ConfirmationDialog } from "@/components/ConfirmationDialog/ConfirmationDialog";
import type { Game, CollectionItem } from "@/types";
import styles from "./CollectionCard.module.css";

interface CollectionCardProps {
  game: Game;
  collectionItem: CollectionItem;
  onStatusChange: (status: GameStatus) => Promise<void>;
  onRatingChange: (rating: number | null) => Promise<void>;
  onRemove: () => Promise<void>;
  loading?: boolean;
}

export function CollectionCard({
  game,
  collectionItem,
  onStatusChange,
  onRatingChange,
  onRemove,
  loading = false,
}: CollectionCardProps) {
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [isChangingRating, setIsChangingRating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleStatusChange = async (newStatus: GameStatus) => {
    try {
      setIsChangingStatus(true);
      await onStatusChange(newStatus);
    } finally {
      setIsChangingStatus(false);
    }
  };

  const handleRatingChange = async (rating: number | null) => {
    try {
      setIsChangingRating(true);
      await onRatingChange(rating);
    } finally {
      setIsChangingRating(false);
    }
  };

  const handleRemoveClick = () => {
    if (collectionItem.status === GameStatus.InProgress) {
      setShowConfirmRemove(true);
    } else {
      handleRemove();
    }
  };

  const handleRemove = async () => {
    try {
      setIsRemoving(true);
      setShowConfirmRemove(false);
      await onRemove();
    } finally {
      setIsRemoving(false);
    }
  };

  const statuses = [
    GameStatus.NotStarted,
    GameStatus.InProgress,
    GameStatus.Completed,
  ];

  return (
    <>
      <div className={styles.card}>
        <img src={game.coverUrl} alt={game.title} className={styles.cover} />

        <div className={styles.content}>
          <h3 className={styles.title}>{game.title}</h3>

          <div className={styles.meta}>
            <span className={styles.genre}>{game.genre}</span>
            <span className={styles.year}>{game.releaseYear}</span>
          </div>

          <div className={styles.platforms}>{game.platform.join(", ")}</div>

          {/* Status Control */}
          <div className={styles.section}>
            <label className={styles.label}>Status</label>
            <select
              className={styles.select}
              value={collectionItem.status}
              onChange={(e) => handleStatusChange(e.target.value as GameStatus)}
              disabled={isChangingStatus}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === GameStatus.NotStarted
                    ? "Not Started"
                    : status === GameStatus.InProgress
                      ? "In Progress"
                      : "Completed"}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Control (only visible for Completed) */}
          {collectionItem.status === GameStatus.Completed && (
            <div className={styles.section}>
              <label className={styles.label}>Rating</label>
              <StarRating
                rating={collectionItem.rating}
                onRatingChange={handleRatingChange}
                disabled={isChangingRating}
              />
            </div>
          )}

          {/* Remove Button */}
          <button
            className={styles.removeButton}
            onClick={handleRemoveClick}
            disabled={isRemoving}
          >
            {isRemoving ? "Removing..." : "Remove from Collection"}
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmRemove}
        title="Remove Game"
        description="This game is currently in progress. Are you sure you want to remove it?"
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleRemove}
        onCancel={() => setShowConfirmRemove(false)}
      />
    </>
  );
}
