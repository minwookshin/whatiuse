"use client";

import "../../styles/whatiuse-base.css";
import "../../styles/components/data-export-progress.css";
import { ArrowCounterClockwise, CheckCircle, DownloadSimple, WarningCircle, X } from "@phosphor-icons/react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Alert } from "./alert";
import { Button } from "./button";
import { IconButton } from "./icon-button";
import { Progress } from "./progress";

export type DataExportProgressStatus = "idle" | "running" | "complete" | "error" | "cancelled";

export type DataExportProgressProps = HTMLAttributes<HTMLDivElement> & {
  status: DataExportProgressStatus;
  progress?: number;
  title?: ReactNode;
  description?: ReactNode;
  fileName?: string;
  processedRows?: number;
  totalRows?: number;
  onCancel?: () => void;
  onRetry?: () => void;
  onDownload?: () => void;
};

export function DataExportProgress({
  status,
  progress = 0,
  title,
  description,
  fileName,
  processedRows,
  totalRows,
  onCancel,
  onRetry,
  onDownload,
  className,
  role,
  ...props
}: DataExportProgressProps) {
  const value = Math.max(0, Math.min(100, progress));
  const defaultTitle = status === "running" ? "Preparing export" : status === "complete" ? "Export ready" : status === "error" ? "Export failed" : status === "cancelled" ? "Export cancelled" : "Export queued";
  const rowDetail = typeof processedRows === "number" && typeof totalRows === "number" ? `${processedRows.toLocaleString()} of ${totalRows.toLocaleString()} rows` : null;
  const detail = description ?? rowDetail ?? fileName;
  const action = status === "running" && onCancel
    ? <IconButton size="small" variant="ghost" aria-label="Cancel export" onClick={onCancel}><X aria-hidden="true" /></IconButton>
    : (status === "error" || status === "cancelled") && onRetry
      ? <Button size="small" variant="secondary" leadingIcon={<ArrowCounterClockwise />} onClick={onRetry}>Retry</Button>
      : status === "complete" && onDownload
        ? <Button size="small" variant="secondary" leadingIcon={<DownloadSimple />} onClick={onDownload}>Download</Button>
        : undefined;
  return (
    <Alert
      className={cn("whatiuse-data-export-progress", className)}
      data-status={status}
      variant={status === "error" ? "critical" : "neutral"}
      title={title ?? defaultTitle}
      icon={status === "complete" ? <CheckCircle weight="fill" /> : status === "error" ? <WarningCircle /> : status === "cancelled" ? <X /> : <DownloadSimple />}
      action={action}
      live={status === "error" ? "assertive" : "polite"}
      role={role}
      {...props}
    >
      {detail && <span>{detail}</span>}
        {status === "running" && <Progress aria-label="Export progress" value={value} showValue size="small" />}
    </Alert>
  );
}
