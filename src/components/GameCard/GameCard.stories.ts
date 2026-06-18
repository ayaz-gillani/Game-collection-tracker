import type { Meta, StoryObj } from "@storybook/react";
import { GameCard } from "./GameCard";
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
  title: "Components/GameCard",
  component: GameCard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GameCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotInCollection: Story = {
  args: {
    game: mockGame,
    isInCollection: false,
    collectionItem: undefined,
    onAddClick: async () => {
      console.log("Add clicked");
    },
    loading: false,
  },
};

export const InCollection: Story = {
  args: {
    game: mockGame,
    isInCollection: true,
    collectionItem: {
      gameId: mockGame.id,
      status: GameStatus.InProgress,
      rating: null,
      dateAdded: Date.now(),
      isactive: true,
    },
    onAddClick: async () => {
      console.log("Add clicked");
    },
    loading: false,
  },
};

export const Completed: Story = {
  args: {
    game: mockGame,
    isInCollection: true,
    collectionItem: {
      gameId: mockGame.id,
      status: GameStatus.Completed,
      rating: 5,
      dateAdded: Date.now(),
      isactive: true,
    },
    onAddClick: async () => {
      console.log("Add clicked");
    },
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    game: mockGame,
    isInCollection: false,
    collectionItem: undefined,
    onAddClick: async () => {
      console.log("Add clicked");
    },
    loading: true,
  },
};
