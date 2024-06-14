import React from "react";
import BaseModal from "../base-modal/BaseModal";
import Session from "#/services/session";

interface LoadPreviousSessionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

function LoadPreviousSessionModal({
  isOpen,
  onOpenChange,
}: LoadPreviousSessionModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      title="Load Previous Session"
      onOpenChange={onOpenChange}
      isDismissable={false}
      actions={[
        {
          label: "Resume Session",
          className: "bg-primary rounded-lg",
          action: Session.restoreOrStartNewSession,
          closeAfterAction: true,
        },
        {
          label: "Start New Session",
          className: "bg-neutral-500 rounded-lg",
          action: Session.startNewSession,
          closeAfterAction: true,
        },
      ]}
    >
      <p>Content for loading previous session goes here.</p>
    </BaseModal>
  );
}

export default LoadPreviousSessionModal;
