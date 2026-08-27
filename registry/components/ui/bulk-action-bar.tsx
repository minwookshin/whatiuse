"use client";

import "../../styles/whatiuse-base.css";
import "../../styles/components/bulk-action-bar.css";
import { ArrowCounterClockwise, CheckCircle, WarningCircle, X } from "@phosphor-icons/react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { IconButton } from "./icon-button";
import { Button } from "./button";
import { Spinner } from "./spinner";

export type BulkActionBarStatus = "ready" | "busy" | "complete" | "error";

export type BulkActionBarProps = HTMLAttributes<HTMLDivElement> & {
  count: number;
  noun?: string;
  actions?: ReactNode;
  onClear: () => void;
  busy?: boolean;
  status?: BulkActionBarStatus;
  message?: ReactNode;
  onUndo?: () => void;
  undoLabel?: string;
};

export function BulkActionBar({ count, noun = "row", actions, onClear, busy = false, status = "ready", message, onUndo, undoLabel = "Undo", className, ...props }: BulkActionBarProps) {
  const resolvedStatus = busy ? "busy" : status;
  if (count <= 0 && resolvedStatus === "ready") return null;
  const feedback = message ?? (resolvedStatus === "complete" ? count > 0 ? `${count} ${count === 1 ? noun : `${noun}s`} updated` : "Selection updated" : resolvedStatus === "error" ? "The action could not be completed" : "Updating selection");
  return (
    <div className={cn("whatiuse-bulk-action-bar", className)} data-status={resolvedStatus} role="region" aria-label="Bulk actions" aria-busy={resolvedStatus === "busy" || undefined} {...props}>
      {resolvedStatus === "ready" ? (
        <div className="whatiuse-bulk-action-bar__selection"><strong>{count}</strong><span>{noun}{count === 1 ? "" : "s"} selected</span></div>
      ) : (
        <div className="whatiuse-bulk-action-bar__feedback">
          {resolvedStatus === "busy" ? <Spinner size="small" label="Updating selection" /> : resolvedStatus === "complete" ? <CheckCircle aria-hidden="true" weight="fill" /> : <WarningCircle aria-hidden="true" />}
          <span>{feedback}</span>
        </div>
      )}
      <div className="whatiuse-bulk-action-bar__actions">{resolvedStatus === "ready" ? actions : resolvedStatus === "complete" && onUndo ? <Button size="small" variant="quiet" leadingIcon={<ArrowCounterClockwise />} onClick={onUndo}>{undoLabel}</Button> : null}</div>
      <IconButton size="small" variant="ghost" aria-label="Clear selection" onClick={onClear}><X aria-hidden="true" /></IconButton>
      <span className="whatiuse-sr-only" aria-live="polite">{resolvedStatus === "ready" ? `${count} ${noun}${count === 1 ? "" : "s"} selected` : feedback}</span>
    </div>
  );
}
