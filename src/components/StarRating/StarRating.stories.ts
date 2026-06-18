import type { Meta, StoryObj } from "@storybook/react";
import { StarRating } from "./StarRating";
import { useState } from "react";

const meta = {
  title: "Components/StarRating",
  component: StarRating,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StarRating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    rating: null,
    onRatingChange: () => {},
    disabled: false,
  },
};

export const ThreeStars: Story = {
  args: {
    rating: 3,
    onRatingChange: () => {},
    disabled: false,
  },
};

export const FiveStars: Story = {
  args: {
    rating: 5,
    onRatingChange: () => {},
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    rating: 4,
    onRatingChange: () => {},
    disabled: true,
  },
};

export const Interactive: Story = {
  args: {
    rating: 3,
    onRatingChange: () => {},
    disabled: false,
  },
};
