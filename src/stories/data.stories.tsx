import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState, type ReactNode } from "react";
import {
  BulkActionBar,
  Button,
  ColumnManager,
  type ColumnManagerColumn,
  DataExportProgress,
  DataState,
  DataTable,
  type DataTableColumn,
  EditableCell,
  QueryBuilder,
  type QueryBuilderCombinator,
  SavedViewMenu,
  type DataViewFilter,
} from "../components/ui";

const meta = { title: "Components/Data", tags: ["test"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

type Account = { id: string; account: string; status: string; owner: string };
const accounts: readonly Account[] = [
  { id: "AC-104", account: "Northstar", status: "Active", owner: "Avery" },
  { id: "AC-103", account: "Fieldwork", status: "At risk", owner: "Mina" },
  { id: "AC-102", account: "Relay", status: "Active", owner: "Noah" },
];
const accountColumns: readonly DataTableColumn<Account>[] = [
  { id: "account", header: "Account", accessor: "account", sortable: true },
  { id: "status", header: "Status", accessor: "status" },
  { id: "owner", header: "Owner", accessor: "owner" },
];

function Stage({ children }: { children: ReactNode }) {
  return <main className="data-component-story"><div className="data-component-story__stage">{children}</div></main>;
}

function DataTableStory() {
  const [order, setOrder] = useState<readonly string[]>(["account", "status", "owner"]);
  return <Stage><div className="data-component-story__stack"><ColumnManager columns={order.map((id) => ({ id, label: id[0].toUpperCase() + id.slice(1), visible: true }))} onVisibilityChange={() => undefined} onOrderChange={setOrder} /><DataTable ariaLabel="Accounts" data={accounts} columns={accountColumns} getRowId={(row) => row.id} columnOrder={order} onColumnOrderChange={setOrder} /></div></Stage>;
}

function ColumnManagerStory() {
  const [columns, setColumns] = useState<ColumnManagerColumn[]>([
    { id: "account", label: "Account", visible: true, required: true, pinned: "start" },
    { id: "status", label: "Status", visible: true },
    { id: "owner", label: "Owner", visible: true },
    { id: "arr", label: "ARR", visible: false },
  ]);
  return <Stage><ColumnManager columns={columns} onVisibilityChange={(id, visible) => setColumns((current) => current.map((column) => column.id === id ? { ...column, visible } : column))} onOrderChange={(ids) => setColumns((current) => ids.flatMap((id) => current.find((column) => column.id === id) ?? []))} onPinningChange={(id, pinned) => setColumns((current) => current.map((column) => column.id === id ? { ...column, pinned } : column))} onResetSizing={() => undefined} /></Stage>;
}

function EditableCellStory() {
  const [owner, setOwner] = useState("Avery Stone");
  return <Stage><EditableCell value={owner} label="owner" validate={(value) => value ? null : "Enter an owner."} onCommit={async (value) => { await new Promise((resolve) => window.setTimeout(resolve, 300)); setOwner(value); }} /></Stage>;
}

function QueryBuilderStory() {
  const [conditions, setConditions] = useState<readonly DataViewFilter[]>([
    { id: "status", fieldId: "status", operator: "is", value: "active" },
  ]);
  const [combinator, setCombinator] = useState<QueryBuilderCombinator>("and");
  return <Stage><QueryBuilder fields={[{ id: "status", label: "Status", kind: "select", values: [{ label: "Active", value: "active" }, { label: "At risk", value: "at-risk" }] }, { id: "owner", label: "Owner", kind: "text" }]} conditions={conditions} combinator={combinator} onApply={(next, nextCombinator) => { setConditions(next); setCombinator(nextCombinator); }} /></Stage>;
}

function SavedViewsStory() {
  const [view, setView] = useState("all");
  return <Stage><SavedViewMenu value={view} onValueChange={setView} views={[{ id: "all", label: "All accounts", count: 24, scope: "system" }, { id: "risk", label: "At risk", count: 4, scope: "personal" }]} onCopyLink={() => undefined} /></Stage>;
}

function BulkActionStory() {
  const [status, setStatus] = useState<"ready" | "busy" | "complete">("ready");
  useEffect(() => {
    if (status !== "busy") return;
    const timer = window.setTimeout(() => setStatus("complete"), 550);
    return () => window.clearTimeout(timer);
  }, [status]);
  return <Stage><BulkActionBar count={3} noun="account" status={status} onClear={() => setStatus("ready")} onUndo={() => setStatus("ready")} actions={<Button size="small" onClick={() => setStatus("busy")}>Archive</Button>} message={status === "complete" ? "Accounts archived" : undefined} /></Stage>;
}

function ExportProgressStory() {
  const [status, setStatus] = useState<"running" | "complete">("running");
  return <Stage><DataExportProgress status={status} progress={status === "running" ? 64 : 100} processedRows={640} totalRows={1_000} fileName="accounts.csv" onCancel={() => setStatus("complete")} onDownload={() => undefined} /></Stage>;
}

export const DataTableOrdering: Story = { render: () => <DataTableStory /> };
export const ColumnManagerControl: Story = { render: () => <ColumnManagerStory /> };
export const EditableCellControl: Story = { render: () => <EditableCellStory /> };
export const QueryBuilderControl: Story = { render: () => <QueryBuilderStory /> };
export const SavedViewsControl: Story = { render: () => <SavedViewsStory /> };
export const BulkActionFeedback: Story = { render: () => <BulkActionStory /> };
export const ExportProgressFeedback: Story = { render: () => <ExportProgressStory /> };
export const PermissionState: Story = { render: () => <Stage><DataState state="forbidden" action={<Button size="small" variant="secondary">Request access</Button>} /></Stage> };
