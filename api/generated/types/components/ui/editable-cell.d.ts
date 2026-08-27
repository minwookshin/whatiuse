import { type HTMLAttributes, type ReactNode } from "react";
export type EditableCellStatus = "idle" | "editing" | "saving" | "error";
export type EditableCellProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
    value: string;
    onCommit: (value: string) => void | Promise<void>;
    onCancel?: () => void;
    validate?: (value: string) => string | null;
    label?: string;
    emptyValue?: ReactNode;
    disabled?: boolean;
};
export declare function EditableCell({ value, onCommit, onCancel, validate, label, emptyValue, disabled, className, ...props }: EditableCellProps): import("react").JSX.Element;
