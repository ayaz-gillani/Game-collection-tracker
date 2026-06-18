import type { Meta, StoryObj } from "@storybook/react";
import { CollectionCard } from "./CollectionCard";
import { GameStatus, GameGenre } from "@/types";

const mockGame = {
  id: "game-001",
  title: "The Witcher 3: Wild Hunt",
  genre: GameGenre.RPG,
  releaseYear: 2015,
  platform: ["PC", "PlayStation", "Xbox"],
  coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6wr.jpg",
  description: "An open-world RPG following Geralt of Rivia",
  isactive: true,
};

const meta = {
  title: "Components/CollectionCard",
  component: CollectionCard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CollectionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotStarted: Story = {
  args: {
    game: mockGame,
    collectionItem: {
      gameId: mockGame.id,
      status: GameStatus.NotStarted,
      rating: null,
      dateAdded: Date.now(),
      isactive: true,
    },
    onStatusChange: async () => console.log("Status changed"),
    onRatingChange: async () => console.log("Rating changed"),
    onRemove: async () => console.log("Removed"),
    loading: false,
  },
};

export const InProgress: Story = {
  args: {
    game: mockGame,
    collectionItem: {
      gameId: mockGame.id,
      status: GameStatus.InProgress,
      rating: null,
      dateAdded: Date.now(),
      isactive: true,
    },
    onStatusChange: async () => console.log("Status changed"),
    onRatingChange: async () => console.log("Rating changed"),
    onRemove: async () => console.log("Removed"),
    loading: false,
  },
};

export const CompletedWithRating: Story = {
  args: {
    game: mockGame,
    collectionItem: {
      gameId: mockGame.id,
      status: GameStatus.Completed,
      rating: 4,
      dateAdded: Date.now(),
      isactive: true,
    },
    onStatusChange: async () => console.log("Status changed"),
    onRatingChange: async () => console.log("Rating changed"),
    onRemove: async () => console.log("Removed"),
    loading: false,
  },
};
