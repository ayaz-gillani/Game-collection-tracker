import { GameStatus } from "@/types";
import styles from "./StatusBadge.module.css";

interface StatusBadgeProps {
  status: GameStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getLabel = () => {
    switch (status) {
      case GameStatus.NotStarted:
        return "Not Started";
      case GameStatus.InProgress:
        return "In Progress";
      case GameStatus.Completed:
        return "Completed";
    }
  };

  return (
    <span className={`${styles.badge} ${styles[status]}`}>{getLabel()}</span>
  );
}
