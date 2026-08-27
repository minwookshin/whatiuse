import { Plus, X } from "@phosphor-icons/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import type { DataFilterOperator, DataFilterValue, DataViewFilter } from "../../lib/data-view-state";
import { Button } from "./button";
import { ButtonGroup } from "./button-group";
import { IconButton } from "./icon-button";
import { SegmentedControl } from "./segmented-control";
import { Select } from "./select";
import { TextField } from "./text-field";

export type QueryBuilderCombinator = "and" | "or";

export type QueryBuilderField = {
  id: string;
  label: string;
  kind?: "text" | "number" | "select";
  operators?: readonly DataFilterOperator[];
  values?: readonly { label: string; value: string }[];
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

const operatorLabels: Record<DataFilterOperator, string> = {
  "is": "is",
  "is-not": "is not",
  "contains": "contains",
  "does-not-contain": "does not contain",
  "greater-than": "is greater than",
  "less-than": "is less than",
  "is-empty": "is empty",
  "is-not-empty": "is not empty",
};

function defaultOperators(field: QueryBuilderField | undefined): readonly DataFilterOperator[] {
  if (field?.operators?.length) return field.operators;
  if (field?.kind === "number") return ["is", "is-not", "greater-than", "less-than", "is-empty", "is-not-empty"];
  return ["is", "is-not", "contains", "does-not-contain", "is-empty", "is-not-empty"];
}

function needsValue(operator: DataFilterOperator): boolean {
  return operator !== "is-empty" && operator !== "is-not-empty";
}

function inputValue(value: DataFilterValue): string {
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

export function QueryBuilder({ fields, conditions, combinator = "and", onApply, onCancel, className, label = "Query" }: QueryBuilderProps) {
  const generatedId = useId();
  const idRef = useRef(0);
  const [draft, setDraft] = useState<readonly DataViewFilter[]>(conditions);
  const [draftCombinator, setDraftCombinator] = useState<QueryBuilderCombinator>(combinator);

  useEffect(() => setDraft(conditions), [conditions]);
  useEffect(() => setDraftCombinator(combinator), [combinator]);

  const fieldOptions = useMemo(() => fields.map((field) => ({ label: field.label, value: field.id })), [fields]);
  const update = (id: string, patch: Partial<DataViewFilter>) => setDraft((current) => current.map((condition) => condition.id === id ? { ...condition, ...patch } : condition));
  const addCondition = () => {
    const field = fields[0];
    if (!field) return;
    idRef.current += 1;
    setDraft((current) => [...current, { id: `${generatedId}-${idRef.current}`, fieldId: field.id, operator: defaultOperators(field)[0] ?? "is", value: "" }]);
  };
  const removeCondition = (id: string) => setDraft((current) => current.filter((condition) => condition.id !== id));
  const cancel = () => {
    setDraft(conditions);
    setDraftCombinator(combinator);
    onCancel?.();
  };

  return (
    <section className={cn("whatiuse-query-builder", className)} aria-labelledby={`${generatedId}-title`}>
      <header className="whatiuse-query-builder__header">
        <strong id={`${generatedId}-title`}>{label}</strong>
        <SegmentedControl
          label="Condition matching"
          value={draftCombinator}
          onValueChange={(value) => { if (value) setDraftCombinator(value as QueryBuilderCombinator); }}
          options={[{ label: "All", value: "and" }, { label: "Any", value: "or" }]}
          size="small"
        />
      </header>
      <div className="whatiuse-query-builder__conditions">
        {draft.map((condition, index) => {
          const field = fields.find((item) => item.id === condition.fieldId) ?? fields[0];
          const operators = defaultOperators(field);
          const valueOptions = field?.values ?? [];
          return (
            <div key={condition.id} className="whatiuse-query-builder__condition" role="group" aria-label={`Condition ${index + 1}`}>
              <Select
                aria-label={`Field for condition ${index + 1}`}
                options={fieldOptions}
                value={condition.fieldId}
                onValueChange={(fieldId) => {
                  const nextField = fields.find((item) => item.id === fieldId);
                  update(condition.id, { fieldId: fieldId ?? condition.fieldId, operator: defaultOperators(nextField)[0] ?? "is", value: "" });
                }}
              />
              <Select
                aria-label={`Operator for condition ${index + 1}`}
                options={operators.map((operator) => ({ label: operatorLabels[operator], value: operator }))}
                value={condition.operator}
                onValueChange={(operator) => update(condition.id, { operator: operator as DataFilterOperator, value: needsValue(operator as DataFilterOperator) ? condition.value : null })}
              />
              {needsValue(condition.operator) && (field?.kind === "select" || valueOptions.length ? (
                <Select
                  aria-label={`Value for condition ${index + 1}`}
                  options={valueOptions}
                  value={inputValue(condition.value)}
                  placeholder="Choose value"
                  onValueChange={(value) => update(condition.id, { value: value ?? "" })}
                />
              ) : (
                <TextField
                  aria-label={`Value for condition ${index + 1}`}
                  type={field?.kind === "number" ? "number" : "text"}
                  value={inputValue(condition.value)}
                  placeholder={field?.placeholder ?? "Value"}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    update(condition.id, { value: field?.kind === "number" && nextValue !== "" ? Number(nextValue) : nextValue });
                  }}
                />
              ))}
              <IconButton size="small" variant="ghost" aria-label={`Remove condition ${index + 1}`} onClick={() => removeCondition(condition.id)}><X aria-hidden="true" /></IconButton>
            </div>
          );
        })}
        {draft.length === 0 && <span>No conditions.</span>}
      </div>
      <footer className="whatiuse-query-builder__footer">
        <Button size="small" variant="quiet" leadingIcon={<Plus />} onClick={addCondition} disabled={fields.length === 0}>Add condition</Button>
        <ButtonGroup aria-label="Query actions">
          <Button size="small" variant="ghost" onClick={cancel}>Cancel</Button>
          <Button size="small" variant="primary" onClick={() => onApply(draft, draftCombinator)}>Apply</Button>
        </ButtonGroup>
      </footer>
    </section>
  );
}
