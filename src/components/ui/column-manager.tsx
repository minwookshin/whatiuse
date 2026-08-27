import {
  ArrowCounterClockwise,
  ArrowDown,
  ArrowUp,
  CaretDown,
  PushPin,
  SlidersHorizontal,
} from "@phosphor-icons/react";
import { Button } from "./button";
import { ButtonGroup } from "./button-group";
import { Checkbox } from "./checkbox";
import { IconButton } from "./icon-button";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "./popover";

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

function nextPin(pin: ColumnManagerPin | undefined): ColumnManagerPin {
  if (!pin) return "start";
  if (pin === "start") return "end";
  return false;
}

function pinLabel(column: ColumnManagerColumn): string {
  if (column.pinned === "start") return `Pin ${column.label} to end`;
  if (column.pinned === "end") return `Unpin ${column.label}`;
  return `Pin ${column.label} to start`;
}

export function ColumnManager({
  columns,
  onVisibilityChange,
  onOrderChange,
  onPinningChange,
  onResetSizing,
  label = "Columns",
}: ColumnManagerProps) {
  const visibleCount = columns.filter((column) => column.visible).length;
  const move = (index: number, offset: -1 | 1) => {
    const target = index + offset;
    if (target < 0 || target >= columns.length) return;
    const orderedIds = columns.map((column) => column.id);
    [orderedIds[index], orderedIds[target]] = [orderedIds[target], orderedIds[index]];
    onOrderChange?.(orderedIds);
  };

  return (
    <Popover>
      <PopoverTrigger
        render={(
          <Button
            size="small"
            variant="ghost"
            leadingIcon={<SlidersHorizontal />}
            trailingIcon={<CaretDown />}
            aria-label={`${visibleCount} of ${columns.length} columns visible`}
          />
        )}
      >
        {label}
      </PopoverTrigger>
      <PopoverContent className="whatiuse-column-manager" align="end">
        <div className="whatiuse-column-manager__header">
          <PopoverTitle className="whatiuse-column-manager__title">Columns</PopoverTitle>
          <span>{visibleCount} visible</span>
        </div>
        <ol className="whatiuse-column-manager__list" aria-label="Table columns">
          {columns.map((column, index) => (
            <li key={column.id} className="whatiuse-column-manager__row" data-pinned={column.pinned || undefined}>
              <Checkbox
                label={column.label}
                checked={column.visible}
                disabled={column.required}
                onCheckedChange={(checked) => onVisibilityChange(column.id, checked)}
              />
              <ButtonGroup aria-label={`${column.label} column actions`}>
                {onPinningChange && (
                  <IconButton
                    size="small"
                    variant="ghost"
                    aria-label={pinLabel(column)}
                    tooltip={pinLabel(column)}
                    onClick={() => onPinningChange(column.id, nextPin(column.pinned))}
                  >
                    <PushPin aria-hidden="true" weight={column.pinned ? "fill" : "regular"} />
                  </IconButton>
                )}
                {onOrderChange && (
                  <>
                    <IconButton size="small" variant="ghost" aria-label={`Move ${column.label} up`} disabled={index === 0} onClick={() => move(index, -1)}>
                      <ArrowUp aria-hidden="true" />
                    </IconButton>
                    <IconButton size="small" variant="ghost" aria-label={`Move ${column.label} down`} disabled={index === columns.length - 1} onClick={() => move(index, 1)}>
                      <ArrowDown aria-hidden="true" />
                    </IconButton>
                  </>
                )}
              </ButtonGroup>
            </li>
          ))}
        </ol>
        {onResetSizing && (
          <Button className="whatiuse-column-manager__reset" size="small" variant="quiet" leadingIcon={<ArrowCounterClockwise />} onClick={onResetSizing}>
            Reset widths
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
