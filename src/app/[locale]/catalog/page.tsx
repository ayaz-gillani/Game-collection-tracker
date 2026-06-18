"use client";

import { useTranslations } from "next-intl";
import { useCollection } from "@/hooks/useCollection";
import { Navigation } from "@/components/Navigation/Navigation";
import { GameCard } from "@/components/GameCard/GameCard";
import { GameStatus } from "@/types";
import { gamesData } from "@/fixtures/games";
import styles from "./page.module.css";

export default function CatalogPage() {
  const t = useTranslations();
  const { state, addGame } = useCollection();
  const { collection } = state;

  const handleAddGame = async (
    gameId: string,
    status: GameStatus,
    rating: number | null,
  ) => {
    console.log(
      "Adding game to collection:",
      gameId,
      "with status:",
      status,
      "and rating:",
      rating,
    );
    await addGame(gameId, status, rating);
  };

  return (
    <div>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>{t("catalog")}</h1>
          <p className={styles.subtitle}>
            Browse and add games to your collection
          </p>

          <div className={styles.grid}>
            {gamesData.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isInCollection={collection[game.id]?.isactive}
                collectionItem={collection[game.id]}
                onAddClick={() =>
                  handleAddGame(
                    game.id,
                    collection[game.id]?.status || GameStatus.NotStarted,
                    collection[game.id]?.rating || null,
                  )
                }
                loading={state.loading}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
