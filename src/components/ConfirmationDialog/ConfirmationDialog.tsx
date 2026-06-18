"use client";

import * as Dialog from "@radix-ui/react-dialog";
import styles from "./ConfirmationDialog.module.css";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <Dialog.Title className={styles.title}>{title}</Dialog.Title>
          <Dialog.Description className={styles.description}>
            {description}
          </Dialog.Description>

          <div className={styles.actions}>
            <button className={styles.cancelButton} onClick={onCancel}>
              {cancelText}
            </button>
            <button className={styles.confirmButton} onClick={onConfirm}>
              {confirmText}
            </button>
          </div>

          <Dialog.Close asChild>
            <button className={styles.closeButton} aria-label="Close">
              ✕
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
