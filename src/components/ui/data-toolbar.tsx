import { ArrowCounterClockwise, CaretDown, FloppyDisk, LinkSimple, Trash } from "@phosphor-icons/react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Button } from "./button";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "./menu";

export type DataToolbarProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  start?: ReactNode;
  end?: ReactNode;
};

export function DataToolbar({ label, start, end, className, ...props }: DataToolbarProps) {
  return <div className={cn("whatiuse-data-toolbar", className)} role="toolbar" aria-label={label} {...props}><div className="whatiuse-data-toolbar__start">{start}</div><div className="whatiuse-data-toolbar__end">{end}</div></div>;
}

export type SavedView = {
  id: string;
  label: string;
  description?: string;
  count?: number;
  scope?: "system" | "personal";
};

export type SavedViewsProps = {
  views: readonly SavedView[];
  value: string;
  onValueChange: (value: string) => void;
  onSaveCurrent?: () => void;
  onUpdateCurrent?: () => void;
  onDeleteCurrent?: () => void;
  onCopyLink?: () => void;
  label?: string;
};

export function SavedViews({ views, value, onValueChange, onSaveCurrent, onUpdateCurrent, onDeleteCurrent, onCopyLink, label = "View" }: SavedViewsProps) {
  const selected = views.find((view) => view.id === value) ?? views[0];
  const canManageCurrent = selected?.scope === "personal";
  return (
    <Menu>
      <MenuTrigger render={<Button size="small" variant="ghost" trailingIcon={<CaretDown />} aria-label={`${label}: ${selected?.label ?? "None"}`} />}>{selected?.label ?? label}</MenuTrigger>
      <MenuContent className="whatiuse-saved-views" align="start">
        <MenuLabel>{label}</MenuLabel>
        <MenuRadioGroup value={value} onValueChange={(nextValue) => onValueChange(nextValue)}>
          {views.map((view) => <MenuRadioItem key={view.id} value={view.id} closeOnClick><span className="whatiuse-saved-views__copy"><strong>{view.label}</strong>{view.description && <small>{view.description}</small>}</span>{typeof view.count === "number" && <small className="whatiuse-saved-views__count">{view.count}</small>}</MenuRadioItem>)}
        </MenuRadioGroup>
        {(onCopyLink || onSaveCurrent || (canManageCurrent && (onUpdateCurrent || onDeleteCurrent))) && <MenuSeparator />}
        {onCopyLink && <MenuItem onClick={onCopyLink}><LinkSimple aria-hidden="true" />Copy view link</MenuItem>}
        {onSaveCurrent && <MenuItem onClick={onSaveCurrent}><FloppyDisk aria-hidden="true" />Save as new view</MenuItem>}
        {canManageCurrent && onUpdateCurrent && <MenuItem onClick={onUpdateCurrent}><ArrowCounterClockwise aria-hidden="true" />Update current view</MenuItem>}
        {canManageCurrent && onDeleteCurrent && <MenuItem className="whatiuse-menu__item--danger" onClick={onDeleteCurrent}><Trash aria-hidden="true" />Delete current view</MenuItem>}
      </MenuContent>
    </Menu>
  );
}
