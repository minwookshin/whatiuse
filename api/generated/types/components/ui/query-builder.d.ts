import type { DataFilterOperator, DataViewFilter } from "../../lib/data-view-state";
export type QueryBuilderCombinator = "and" | "or";
export type QueryBuilderField = {
    id: string;
    label: string;
    kind?: "text" | "number" | "select";
    operators?: readonly DataFilterOperator[];
    values?: readonly {
        label: string;
        value: string;
    }[];
    placeholder?: string;
};
export type QueryBuilderProps = {
    fields: readonly QueryBuilderField[];
    conditions: readonly DataViewFilter[];
    combinator?: QueryBuilderCombinator;
    onApply: (conditions: readonly DataViewFilter[], combinator: QueryBuilderCombinator) => void;
    onCancel?: () => void;
    className?: string;
    label?: string;
};
export declare function QueryBuilder({ fields, conditions, combinator, onApply, onCancel, className, label }: QueryBuilderProps): import("react").JSX.Element;
