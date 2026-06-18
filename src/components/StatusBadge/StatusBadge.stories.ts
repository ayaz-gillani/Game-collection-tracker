import type { Meta, StoryObj } from "@storybook/react";
import { StatusBadge } from "./StatusBadge";
import { GameStatus } from "@/types";

const meta = {
  title: "Components/StatusBadge",
  component: StatusBadge,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotStarted: Story = {
  args: {
    status: GameStatus.NotStarted,
  },
};

export const InProgress: Story = {
  args: {
    status: GameStatus.InProgress,
  },
};

export const Completed: Story = {
  args: {
    status: GameStatus.Completed,
  },
};
