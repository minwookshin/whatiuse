import { CaretRight, Check, Copy, ShieldCheck } from "@phosphor-icons/react";
import { lazy, Suspense, useState, type ReactNode } from "react";
import packageManifest from "../../package.json";
import accessibilityEvidence from "../../release/accessibility.json";
import agentEvaluation from "../../release/agent-evaluation.json";
import nextQuickstartManifest from "../../examples/quickstart-next/package.json";
import { componentMaturity, readyCandidateComponents } from "../component-maturity";
import { copyText } from "../lib/copy-text";
import {
  whatiuseDataComponentContracts,
  whatiuseDataRecipeContracts,
  whatiuseDataViewStateContract,
} from "../lib/whatiuse-data-contract";
import {
  whatiuseAnalyticsComponentContracts,
  whatiuseAnalyticsRecipeContracts,
  whatiuseAnalyticsStateContract,
} from "../lib/whatiuse-analytics-contract";
import {
  whatiuseProductPatternContracts,
  whatiuseProductPatternSystemContract,
} from "../lib/whatiuse-product-patterns-contract";
import {
  whatiuseAgentSelectionRules,
  whatiuseAgentSystemContract,
} from "../lib/whatiuse-agent-contract";
import { publicDocItems, type PublicDocId } from "./public-doc-metadata";

const CustomerWorkspaceRecipe = lazy(() => import("./product-pattern-recipes").then((module) => ({ default: module.CustomerWorkspaceRecipe })));
const BillingUsageRecipe = lazy(() => import("./product-pattern-recipes").then((module) => ({ default: module.BillingUsageRecipe })));
const MembersPermissionsRecipe = lazy(() => import("./product-pattern-recipes").then((module) => ({ default: module.MembersPermissionsRecipe })));
const shadcnCli = `shadcn@${packageManifest.devDependencies.shadcn}`;
const publicDataComponentContracts = whatiuseDataComponentContracts.filter(
  (component) => component.id !== "query-builder",
);

function DocSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section className="public-doc-section" id={id}><h2>{title}</h2>{children}</section>;
}

function CodeBlock({ label, children, collapsed = false }: { label: string; children: string; collapsed?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(!collapsed);
  const copy = () => void copyText(children).then((result) => {
    setCopied(result);
    window.setTimeout(() => setCopied(false), 1200);
  });
  return <figure className="public-doc-code" data-collapsed={!open || undefined}><figcaption><button className="public-doc-code__toggle" type="button" aria-expanded={open} onClick={() => setOpen((current) => !current)}><CaretRight aria-hidden="true" />{label}</button><button className="public-doc-code__copy" type="button" title={copied ? "Copied" : "Copy code"} onClick={copy} aria-label={copied ? `${label} copied` : `Copy ${label}`}>{copied ? <Check weight="bold" aria-hidden="true" /> : <Copy aria-hidden="true" />}</button></figcaption>{open && <pre tabIndex={0}><code>{children}</code></pre>}</figure>;
}

function CheckList({ items }: { items: readonly string[] }) {
  return <ul className="public-doc-checks">{items.map((item) => <li key={item}><Check aria-hidden="true" /><span>{item}</span></li>)}</ul>;
}

function StatusTable({ label, rows, columns = ["Target", "Level", "Evidence"] }: { label: string; rows: readonly (readonly [string, string, string])[]; columns?: readonly [string, string, string] }) {
  return <div className="public-doc-table-wrap" role="region" aria-label={`${label} scroll area`} tabIndex={0}><table aria-label={label}><thead><tr>{columns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr></thead><tbody>{rows.map(([target, level, evidence]) => <tr key={target}><th scope="row">{target}</th><td>{level}</td><td>{evidence}</td></tr>)}</tbody></table></div>;
}

function DecisionTable({ label, rows }: { label: string; rows: readonly (readonly [string, string, string])[] }) {
  return <div className="public-doc-table-wrap public-doc-decision-table" role="region" aria-label={`${label} scroll area`} tabIndex={0}><table aria-label={label}><thead><tr><th scope="col">User need</th><th scope="col">Choose</th><th scope="col">Do not use it when</th></tr></thead><tbody>{rows.map(([need, choice, boundary]) => <tr key={need}><th scope="row">{need}</th><td><strong>{choice}</strong></td><td>{boundary}</td></tr>)}</tbody></table></div>;
}

function DataPage() {
  return <>
    <DocSection id="data-layer" title="Product primitives">
      <StatusTable
        label="whatiuse Data product primitives"
        columns={["Primitive", "Job", "States"]}
        rows={publicDataComponentContracts.map((component) => [component.id, component.intent, component.states.join(", ")] as const)}
      />
    </DocSection>
    <DocSection id="data-contract" title="Composition contract">
      <p>URL, server, saved-view, and display state share one model.</p>
      <CodeBlock label="data-view-state.contract.json" collapsed>{JSON.stringify(whatiuseDataViewStateContract, null, 2)}</CodeBlock>
      <CodeBlock label="data-recipes.contract.json" collapsed>{JSON.stringify(whatiuseDataRecipeContracts, null, 2)}</CodeBlock>
    </DocSection>
    <DocSection id="data-install" title="Install the vertical slice">
      <CodeBlock label={`Pinned ${packageManifest.version}`}>{`npx ${shadcnCli} add @whatiuse/whatiuse-data`}</CodeBlock>
      <p>Installs the Data components, recipes, styles, and contracts. Pre-release.</p>
    </DocSection>
  </>;
}

function AnalyticsPage() {
  return <>
    <DocSection id="analytics-layer" title="Product primitives">
      <StatusTable label="whatiuse Analytics product primitives" columns={["Primitive", "Job", "States"]} rows={whatiuseAnalyticsComponentContracts.map((component) => [component.id, component.intent, component.states.join(", ")] as const)} />
    </DocSection>
    <DocSection id="analytics-contract" title="Composition contract">
      <p>Product state remains controlled by the recipe. Transient inspection stays local to each chart.</p>
      <CodeBlock label="analytics-state.contract.json" collapsed>{JSON.stringify(whatiuseAnalyticsStateContract, null, 2)}</CodeBlock>
      <CodeBlock label="analytics-recipes.contract.json" collapsed>{JSON.stringify(whatiuseAnalyticsRecipeContracts, null, 2)}</CodeBlock>
    </DocSection>
    <DocSection id="analytics-install" title="Install the vertical slice">
      <CodeBlock label={`Pinned ${packageManifest.version}`}>{`npx ${shadcnCli} add @whatiuse/whatiuse-analytics`}</CodeBlock>
      <p>Installs the Analytics components, recipes, styles, and contracts. Pre-release.</p>
    </DocSection>
  </>;
}

function ProductPatternsPage() {
  return <>
    <section className="public-doc-section public-doc-section--pilot" id="customer-workspace" aria-labelledby="customer-workspace-title"><h2 id="customer-workspace-title">Customer Workspace</h2><p>Find an account, inspect health, and finish a follow-up without losing the list.</p><Suspense fallback={<div className="whatiuse-product-pattern" role="status">Loading Customer Workspace…</div>}><CustomerWorkspaceRecipe /></Suspense></section>
    <section className="public-doc-section public-doc-section--pilot" id="billing-usage" aria-labelledby="billing-usage-title"><h2 id="billing-usage-title">Billing &amp; Usage</h2><p>Plan, spend, limits, usage, and invoices share one billing period.</p><Suspense fallback={<div className="whatiuse-product-pattern" role="status">Loading Billing &amp; Usage…</div>}><BillingUsageRecipe /></Suspense></section>
    <DocSection id="product-pattern-contract" title="Composition contract">
      <p>Each workflow names its task, state owner, failure states, and keyboard boundary.</p>
      <CodeBlock label="product-patterns.contract.json">{JSON.stringify(whatiuseProductPatternContracts, null, 2)}</CodeBlock>
      <CodeBlock label="product-pattern-system.contract.json">{JSON.stringify(whatiuseProductPatternSystemContract, null, 2)}</CodeBlock>
    </DocSection>
    <DocSection id="product-pattern-install" title="Install workflows">
      <CodeBlock label={`Pinned ${packageManifest.version}`}>{`npx ${shadcnCli} add @whatiuse/whatiuse-product-patterns`}</CodeBlock>
      <p>Installs the workflow and collaboration recipes. Pre-release.</p>
    </DocSection>
  </>;
}

function CollaborationPatternsPage() {
  const memberContract = whatiuseProductPatternContracts.filter((contract) => contract.id === "members-permissions");
  return <>
    <section className="public-doc-section public-doc-section--pilot" id="members-permissions" aria-labelledby="members-permissions-title"><h2 id="members-permissions-title">Members &amp; Permissions</h2><p>Invite people, assign roles, and review access in one task.</p><Suspense fallback={<div className="whatiuse-product-pattern" role="status">Loading Members &amp; Permissions…</div>}><MembersPermissionsRecipe /></Suspense></section>
    <DocSection id="collaboration-contract" title="Composition contract">
      <p>Shared work keeps identity, permission, and recovery visible.</p>
      <CodeBlock label="collaboration.contract.json">{JSON.stringify(memberContract, null, 2)}</CodeBlock>
    </DocSection>
    <DocSection id="collaboration-install" title="Install collaboration patterns">
      <CodeBlock label={`Pinned ${packageManifest.version}`}>{`npx ${shadcnCli} add @whatiuse/whatiuse-product-patterns`}</CodeBlock>
      <p>Installs the shared pattern bundle. Pre-release.</p>
    </DocSection>
  </>;
}

function AgentNativePage() {
  return <>
    <DocSection id="agent-contract" title="Use the public contract">
      <p>The catalog lists every item, recipe, and selection boundary an agent may use.</p>
      <CodeBlock label="whatiuse-agent.json">{`${packageManifest.homepage}/agent/whatiuse-agent.json`}</CodeBlock>
      <CodeBlock label="system.contract.json" collapsed>{JSON.stringify(whatiuseAgentSystemContract, null, 2)}</CodeBlock>
    </DocSection>
    <DocSection id="selection-rules" title="Choose by task">
      <StatusTable label="Agent selection rules" columns={["Task", "Choose", "Reject when"]} rows={whatiuseAgentSelectionRules.map((rule) => [rule.task, rule.choose, rule.rejectWhen.join(" ")] as const)} />
    </DocSection>
    <DocSection id="skill-install" title="Install the skill">
      <CodeBlock label="Install">{`npx skills add minwookshin/whatiuse --skill whatiuse --copy --yes`}</CodeBlock>
      <p>Review the copied skill before use.</p>
    </DocSection>
    <DocSection id="agent-evaluation" title="Evaluation">
      <StatusTable label="Agent evaluation evidence" rows={[["Recipe selection", `${agentEvaluation.selectedCorrectly} / ${agentEvaluation.taskCount}`, "Thirty fixed B2B product requests"], ["Clean install and build", agentEvaluation.productionBuild, agentEvaluation.scope], ["Contract violations", String(agentEvaluation.contractViolations), "Required and forbidden component checks"]]} />
      <p>Repository evidence only. This is not an external model benchmark.</p>
    </DocSection>
  </>;
}

function ComponentStatus() {
  return <>
    <DocSection id="runtime-support" title="Runtime">
      <StatusTable label="Runtime compatibility" columns={["Dependency", "Range", "Status"]} rows={[
        ["React", packageManifest.peerDependencies.react, "React 18 and 19 tested"],
        ["TypeScript", packageManifest.devDependencies.typescript, "Strict build verified"],
        ["Base UI", packageManifest.dependencies["@base-ui/react"], "Primitive dependency"],
        ["React Aria", packageManifest.dependencies["react-aria-components"], "Date and calendar behavior"],
      ]} />
    </DocSection>
    <DocSection id="browser-support" title="Browsers">
      <StatusTable label="Browser compatibility" rows={[
        ["Chromium, Firefox, WebKit", "Automated", "Routes, themes, disclosures, and overflow"],
        ["Mobile engines", "Emulated", "iPhone and Pixel viewports"],
        ["Physical devices", "Manual gate", "Required before a component becomes Ready"],
      ]} />
    </DocSection>
    <DocSection id="release-status" title={`Release ${packageManifest.version}`}>
      <CheckList items={["Registry source is available; the npm package is not published.", `${readyCandidateComponents.map((component) => component.name).join(", ")} pass the internal RC gate and are Ready candidates.`, `${componentMaturity.length} component contracts are checked in the repository.`, "Independent adoption and manual assistive-technology review remain external gates before Ready."]} />
    </DocSection>
  </>;
}

function Installation() {
  const pinnedRegistry = `${packageManifest.homepage}/r/v/${packageManifest.version}/{name}.json`;
  return <>
    <DocSection id="install" title="Install">
      <p>Run these commands inside an existing React and TypeScript project.</p>
      <CodeBlock label={`Pinned ${packageManifest.version}`}>{`npx ${shadcnCli} registry add @whatiuse=${pinnedRegistry}\nnpx ${shadcnCli} add @whatiuse/button`}</CodeBlock>
      <CodeBlock label="Render Button" collapsed>{'import { Button } from "./components/ui/button";\n\nexport function App() {\n  return <Button>Create issue</Button>;\n}'}</CodeBlock>
    </DocSection>
    <DocSection id="frameworks" title="Frameworks">
      <StatusTable label="Framework setup" columns={["Project", "Boundary", "CSS"]} rows={[
        ["Vite", "React 18 or 19", "Import the generated CSS once from src/index.css"],
        [`Next.js ${nextQuickstartManifest.dependencies.next}`, "Use a client boundary only for interactive compositions", "Import the generated CSS once from the root layout"],
      ]} />
      <p>Verified examples live in <code>examples/quickstart-vite</code> and <code>examples/quickstart-next</code>.</p>
    </DocSection>
    <DocSection id="theme" title="Theme">
      <CodeBlock label="Theme and one token">{'document.documentElement.dataset.theme = "dark";\n\n:root {\n  --whatiuse-radius-control: 6px;\n}'}</CodeBlock>
      <p>Override semantic <code>--whatiuse-*</code> roles in product CSS.</p>
    </DocSection>
    <DocSection id="update" title="Update">
      <CodeBlock label="Review, then accept">{`npx ${shadcnCli} add @whatiuse/button --dry-run\nnpx ${shadcnCli} add @whatiuse/button --diff src/components/ui/button.tsx\nnpx ${shadcnCli} add @whatiuse/button --overwrite --yes`}</CodeBlock>
      <p>Commit local edits first. Dry-run and diff do not write.</p>
    </DocSection>
    <DocSection id="troubleshooting" title="Troubleshooting">
      <StatusTable label="Installation troubleshooting" columns={["Symptom", "Cause", "Fix"]} rows={[
        ["Registry cannot resolve", "The registry entry is missing", "Run registry add before installing a component"],
        ["Styles are missing", "A generated CSS import was removed", "Restore the generated base and component CSS imports"],
        ["Next.js boundary error", "Interactive UI crossed a server boundary", "Move the composition into a small client component"],
      ]} />
    </DocSection>
  </>;
}

function ChoosingComponents() {
  return <>
    <DocSection id="selection" title="Choose by the value being changed">
      <p>Controls that look similar can carry different data, timing, and comparison contracts. Keep them separate so product intent remains visible in code and behavior.</p>
      <DecisionTable label="Selection component decisions" rows={[
        ["Choose one short, predefined form value", "Select", "Filtering is needed or the surrounding product context changes"],
        ["Filter a large, predefined collection", "Combobox", "Free-form text is a valid submitted value"],
        ["Change workspace, platform, or environment context", "Context Switcher", "The value is an ordinary form field"],
        ["Compare a small set of form choices", "Radio Group", "Space is constrained or the set is long"],
        ["Switch between two to four immediate peer modes", "Segmented Control", "Options need descriptions or submit later"],
      ]} />
    </DocSection>
    <DocSection id="temporary-surfaces" title="Choose by focus and task size">
      <DecisionTable label="Temporary surface decisions" rows={[
        ["Explain one otherwise understandable control", "Tooltip", "Content is required or interactive"],
        ["Expose a compact contextual action set", "Menu", "Actions need search, grouping, and keyboard-first discovery"],
        ["Search and run many cross-product actions", "Action List", "The set is a small anchored menu"],
        ["Keep a few controls beside their origin", "Popover", "The task needs full attention or a long form"],
        ["Complete a short, reversible focused task", "Dialog", "An explicit consequential response is required"],
        ["Confirm an irreversible or consequential decision", "Alert Dialog", "The action is safely reversible without interruption"],
      ]} />
    </DocSection>
    <DocSection id="feedback-recovery" title="Separate information from recovery">
      <DecisionTable label="Feedback and recovery decisions" rows={[
        ["Explain a field-specific problem", "Field error", "The message applies to the whole task"],
        ["Keep important contextual status visible", "Alert", "The outcome is transient and secondary"],
        ["Confirm a brief non-blocking outcome", "Toast", "The user must respond before continuing"],
        ["Reverse one or more reliable mutations", "Undo Stack", "The inverse is unsafe, lossy, or unavailable"],
      ]} />
    </DocSection>
    <DocSection id="decision-rule" title="Do not merge by shape"><div className="public-doc-callout"><ShieldCheck aria-hidden="true" /><div><strong>Task, focus, and recovery are the boundary</strong><p>If two components share a trigger or floating rectangle but change different kinds of state, move focus differently, or promise different recovery, they remain separate components with shared visual tokens.</p></div></div></DocSection>
  </>;
}

function Accessibility() {
  return <>
    <DocSection id="baseline-contract" title="Baseline contract"><CheckList items={["Use semantic HTML and tested accessible primitives.", "Name every icon-only control.", "Keep disabled, validation, loading, empty, and recovery states perceivable.", "Use automated checks to support, not replace, manual review."]} /></DocSection>
    <DocSection id="keyboard-focus" title="Keyboard and focus"><p>Keyboard and pointer input complete the same task. Dismissed surfaces return focus to their trigger.</p></DocSection>
    <DocSection id="motion-contrast" title="Motion and contrast"><p>Reduced motion removes travel, not state feedback. Structure remains clear in light, dark, increased-contrast, and forced-color modes.</p></DocSection>
    <DocSection id="manual-review" title="Evidence matrix"><StatusTable label="Accessibility release review" rows={[[`${accessibilityEvidence.routes.public} public routes`, "Automated gate", `${accessibilityEvidence.passed} applicable checks passed, ${accessibilityEvidence.skipped} intentional project skips, zero failures`], [`${componentMaturity.length} component routes`, "Automated gate", "Serious and critical axe findings, overflow, atomic shortcut geometry, and one-page-heading ownership"], ["200% equivalent", "Automated + browser review", "All component routes at a 640px CSS viewport with no lost content or horizontal page overflow"], ["Forced colors / reduced motion", "Automated gate", "System colors preserve structure; non-essential spatial motion is removed or reduced"], ["Keyboard", "Five-project task paths", "Skip paths, route announcements, compact focus handoff, Menu and Dialog focus return, and whatiuse Data recovery"], ["Screen reader / physical devices", "External gate", "Manual assistive-technology and touch-device sign-off remains required before any component becomes Ready"]]} /></DocSection>
  </>;
}

function Support() {
  return <>
    <DocSection id="security-reporting" title="Security">
      <p>Report vulnerabilities through the repository's private security advisory flow. Do not post exploit details in a public issue.</p>
    </DocSection>
    <DocSection id="contributing" title="Contributing">
      <CodeBlock label="Local checks">{"npm install\nnpm run dev\nnpm run quality"}</CodeBlock>
      <p>Include the product case, API change, keyboard path, motion choice, and tests.</p>
    </DocSection>
    <DocSection id="license" title="MIT license"><p>Use, modify, and distribute the source under the repository's MIT license. Keep the copyright and permission notice with substantial copies.</p></DocSection>
  </>;
}

function Licensing() {
  return <>
    <DocSection id="license" title="MIT license"><div className="public-doc-callout"><ShieldCheck aria-hidden="true" /><div><strong>Permissive by design</strong><p>The repository includes the MIT license. The full LICENSE file is the legal source of truth.</p></div></div></DocSection>
    <DocSection id="permissions" title="Permissions"><CheckList items={["Use the system in personal and commercial products.", "Copy, modify, merge, publish, distribute, sublicense, and sell copies.", "Keep the copyright and permission notice with substantial copies."]} /></DocSection>
    <DocSection id="notices" title="Notices"><p>Attribution does not need to appear in the product interface. Preserve the MIT notice and each dependency's license in distributed source or legal notices.</p></DocSection>
  </>;
}

const contentById: Record<PublicDocId, (props: { onNavigate: (id: string) => void }) => ReactNode> = {
  installation: Installation,
  "choosing-components": ChoosingComponents,
  "product-pilot": DataPage,
  analytics: AnalyticsPage,
  "product-patterns": ProductPatternsPage,
  "collaboration-patterns": CollaborationPatternsPage,
  "agent-native": AgentNativePage,
  "component-status": ComponentStatus,
  accessibility: Accessibility,
  support: Support,
  licensing: Licensing,
};

export function PublicDocPage({ id, onNavigate }: { id: PublicDocId; onNavigate: (id: string) => void }) {
  const doc = publicDocItems.find((item) => item.id === id)!;
  const Content = contentById[id];
  return <div className={"system-detail__content public-doc-page system-reference-page" + (["product-patterns", "collaboration-patterns"].includes(id) ? " public-doc-page--pilot" : "")}>
    <section className="system-overview" id="system-overview"><span className="public-doc-kicker">{doc.group}</span><h1>{doc.label}</h1><p>{doc.description}</p></section><div className="public-doc-body"><Content onNavigate={onNavigate} /></div>
    <footer className="system-footer"><span>whatiuse</span><span>Public system documentation</span></footer>
  </div>;
}
