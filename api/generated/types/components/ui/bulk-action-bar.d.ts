import type { HTMLAttributes, ReactNode } from "react";
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
export declare function BulkActionBar({ count, noun, actions, onClear, busy, status, message, onUndo, undoLabel, className, ...props }: BulkActionBarProps): import("react").JSX.Element | null;
