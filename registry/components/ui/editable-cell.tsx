"use client";

import "../../styles/whatiuse-base.css";
import "../../styles/components/editable-cell.css";
import { Check, PencilSimple, X } from "@phosphor-icons/react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import { ButtonGroup } from "./button-group";
import { IconButton } from "./icon-button";
import { Spinner } from "./spinner";

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

export function EditableCell({
  value,
  onCommit,
  onCancel,
  validate,
  label = "value",
  emptyValue = "Not set",
  disabled = false,
  className,
  ...props
}: EditableCellProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mountedRef = useRef(true);
  const [draft, setDraft] = useState(value);
  const [status, setStatus] = useState<EditableCellStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);
  useEffect(() => {
    if (status === "idle") setDraft(value);
  }, [status, value]);
  useEffect(() => {
    if (status === "editing") inputRef.current?.select();
  }, [status]);

  const begin = () => {
    if (disabled) return;
    setDraft(value);
    setError(null);
    setStatus("editing");
  };
  const restoreTrigger = () => requestAnimationFrame(() => triggerRef.current?.focus());
  const cancel = () => {
    setDraft(value);
    setError(null);
    setStatus("idle");
    onCancel?.();
    restoreTrigger();
  };
  const commit = async () => {
    if (status === "saving") return;
    const next = draft.trim();
    const validationError = validate?.(next) ?? null;
    if (validationError) {
      setError(validationError);
      setStatus("error");
      inputRef.current?.focus();
      return;
    }
    if (next === value) {
      setStatus("idle");
      restoreTrigger();
      return;
    }
    setError(null);
    setStatus("saving");
    try {
      await onCommit(next);
      if (!mountedRef.current) return;
      setStatus("idle");
      restoreTrigger();
    } catch (reason) {
      if (!mountedRef.current) return;
      setError(reason instanceof Error ? reason.message : "Could not save the value.");
      setStatus("error");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void commit();
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    cancel();
  };

  return (
    <div className={cn("whatiuse-editable-cell", className)} data-status={status} {...props}>
      {status === "idle" ? (
        <button ref={triggerRef} type="button" className="whatiuse-editable-cell__trigger" onClick={begin} disabled={disabled} aria-label={`Edit ${label}`}>
          <span>{value || emptyValue}</span>
          {!disabled && <PencilSimple aria-hidden="true" />}
        </button>
      ) : (
        <form className="whatiuse-editable-cell__form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            id={inputId}
            className="whatiuse-editable-cell__input"
            value={draft}
            disabled={status === "saving"}
            aria-label={`Edit ${label}`}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => { setDraft(event.target.value); if (error) { setError(null); setStatus("editing"); } }}
            onKeyDown={handleKeyDown}
          />
          <ButtonGroup className="whatiuse-editable-cell__actions" aria-label="Editing actions">
            {status === "saving" ? <Spinner size="small" label="Saving value" /> : (
              <>
                <IconButton size="small" variant="ghost" aria-label="Save value" type="submit"><Check aria-hidden="true" /></IconButton>
                <IconButton size="small" variant="ghost" aria-label="Cancel editing" onClick={cancel}><X aria-hidden="true" /></IconButton>
              </>
            )}
          </ButtonGroup>
        </form>
      )}
      <span id={errorId} className="whatiuse-editable-cell__error" aria-live="polite">{error}</span>
    </div>
  );
}
