"use client";

import { useState } from "react";
import styles from "./StarRating.module.css";

interface StarRatingProps {
  rating: number | null;
  onRatingChange: (rating: number | null) => void;
  disabled?: boolean;
}

export function StarRating({
  rating,
  onRatingChange,
  disabled = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleStarClick = (starValue: number) => {
    if (disabled) return;
    // Toggle: clicking the same rating removes it
    onRatingChange(rating === starValue ? null : starValue);
  };

  const handleStarHover = (starValue: number) => {
    if (disabled) return;
    setHoverRating(starValue);
  };

  const displayRating = hoverRating ?? rating ?? 0;

  return (
    <div className={`${styles.container} ${disabled ? styles.disabled : ""}`}>
      {[1, 2, 3, 4, 5].map((starValue) => (
        <button
          key={starValue}
          className={`${styles.star} ${starValue <= displayRating ? styles.filled : ""}`}
          onClick={() => handleStarClick(starValue)}
          onMouseEnter={() => handleStarHover(starValue)}
          onMouseLeave={() => setHoverRating(null)}
          disabled={disabled}
          aria-label={`Rate ${starValue} stars`}
          type="button"
        >
          ★
        </button>
      ))}
    </div>
  );
}
