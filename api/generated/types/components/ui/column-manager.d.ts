export type ColumnManagerPin = false | "start" | "end";
export type ColumnManagerColumn = {
    id: string;
    label: string;
    visible: boolean;
    required?: boolean;
    pinned?: ColumnManagerPin;
};
export type ColumnManagerProps = {
    columns: readonly ColumnManagerColumn[];
    onVisibilityChange: (id: string, visible: boolean) => void;
    onOrderChange?: (orderedIds: readonly string[]) => void;
    onPinningChange?: (id: string, pinned: ColumnManagerPin) => void;
    onResetSizing?: () => void;
    label?: string;
};
export declare function ColumnManager({ columns, onVisibilityChange, onOrderChange, onPinningChange, onResetSizing, label, }: ColumnManagerProps): import("react").JSX.Element;
