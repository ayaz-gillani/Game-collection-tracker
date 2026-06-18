"use client";

import { GameGenre } from "@/types";
import styles from "./FilterBar.module.css";

type SortOption = "title" | "rating" | "dateAdded";

interface FilterBarProps {
  selectedGenres: string[];
  onGenreChange: (genres: string[]) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function FilterBar({
  selectedGenres,
  onGenreChange,
  sortBy,
  onSortChange,
}: FilterBarProps) {
  const genres = Object.values(GameGenre);

  const handleGenreToggle = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];
    onGenreChange(newGenres);
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <label className={styles.label}>Genres</label>
        <div className={styles.genreGrid}>
          {genres.map((genre) => (
            <label key={genre} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selectedGenres.includes(genre)}
                onChange={() => handleGenreToggle(genre)}
              />
              <span>{genre}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <label htmlFor="sort" className={styles.label}>
          Sort By
        </label>
        <select
          id="sort"
          className={styles.select}
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
        >
          <option value="dateAdded">Recently Added</option>
          <option value="title">Title (A-Z)</option>
          <option value="rating">Rating (High to Low)</option>
        </select>
      </div>
    </div>
  );
}
