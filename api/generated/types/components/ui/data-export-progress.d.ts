import type { HTMLAttributes, ReactNode } from "react";
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
export declare function DataExportProgress({ status, progress, title, description, fileName, processedRows, totalRows, onCancel, onRetry, onDownload, className, role, ...props }: DataExportProgressProps): import("react").JSX.Element;
