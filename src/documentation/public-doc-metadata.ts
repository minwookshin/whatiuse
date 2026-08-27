export const publicDocItems = [
  { id: "installation", label: "Installation", group: "Getting started", description: "Add the registry and install a component.", navigation: true },
  { id: "agent-native", label: "Coding agents", group: "Getting started", description: "Give coding agents the same component rules.", navigation: true },
  { id: "choosing-components", label: "Core", group: "Components", description: "Choose interface primitives by task, focus, and recovery.", navigation: true },
  { id: "product-pilot", label: "Data", group: "Components", description: "Tables, filters, bulk actions, and product data workflows.", navigation: true },
  { id: "analytics", label: "Analytics", group: "Components", description: "Metrics, charts, comparison views, and analytic workflows.", navigation: true },
  { id: "product-patterns", label: "Workflow", group: "Patterns", description: "Customer and billing workflows.", navigation: false },
  { id: "collaboration-patterns", label: "Collaboration", group: "Patterns", description: "People, roles, and access.", navigation: false },
  { id: "component-status", label: "Compatibility", group: "Reference", description: "Runtime, browser, and release boundaries.", navigation: true },
  { id: "accessibility", label: "Accessibility", group: "Reference", description: "Keyboard, focus, motion, contrast, and assistive technology.", navigation: true },
  { id: "support", label: "Open source", group: "Reference", description: "Security, contributions, and MIT terms.", navigation: true },
  { id: "licensing", label: "License", group: "Reference", description: "MIT terms and third-party notices.", navigation: false },
] as const;

export type PublicDocId = (typeof publicDocItems)[number]["id"];
export type PublicDocGroup = (typeof publicDocItems)[number]["group"];

export const legacyPublicDocAliases = {
  "browser-support": "component-status",
  security: "support",
  contributing: "support",
  releases: "component-status",
} as const satisfies Record<string, PublicDocId>;

export function resolvePublicDocId(value: string): PublicDocId | undefined {
  const current = publicDocItems.find((item) => item.id === value);
  if (current) return current.id;
  return legacyPublicDocAliases[value as keyof typeof legacyPublicDocAliases];
}

export const publicDocOutlines: Record<PublicDocId, readonly { id: string; label: string }[]> = {
  installation: [
    { id: "install", label: "Install" },
    { id: "frameworks", label: "Frameworks" },
    { id: "theme", label: "Theme" },
    { id: "update", label: "Update" },
    { id: "troubleshooting", label: "Troubleshooting" },
  ],
  "choosing-components": [
    { id: "selection", label: "Selection" },
    { id: "temporary-surfaces", label: "Temporary surfaces" },
    { id: "feedback-recovery", label: "Feedback and recovery" },
    { id: "decision-rule", label: "Decision rule" },
  ],
  "product-pilot": [
    { id: "data-layer", label: "Product primitives" },
    { id: "data-contract", label: "Composition contract" },
    { id: "data-install", label: "Install" },
  ],
  analytics: [
    { id: "analytics-layer", label: "Product primitives" },
    { id: "analytics-contract", label: "Composition contract" },
    { id: "analytics-install", label: "Install" },
  ],
  "product-patterns": [
    { id: "customer-workspace", label: "Customer Workspace" },
    { id: "billing-usage", label: "Billing & Usage" },
    { id: "product-pattern-contract", label: "Composition contract" },
    { id: "product-pattern-install", label: "Install" },
  ],
  "collaboration-patterns": [
    { id: "members-permissions", label: "Members & Permissions" },
    { id: "collaboration-contract", label: "Composition contract" },
    { id: "collaboration-install", label: "Install" },
  ],
  "agent-native": [
    { id: "agent-contract", label: "Contract" },
    { id: "selection-rules", label: "Selection" },
    { id: "skill-install", label: "Install" },
    { id: "agent-evaluation", label: "Evaluation" },
  ],
  "component-status": [
    { id: "runtime-support", label: "Runtime" },
    { id: "browser-support", label: "Browsers" },
    { id: "release-status", label: "Release" },
  ],
  accessibility: [
    { id: "baseline-contract", label: "Baseline contract" },
    { id: "keyboard-focus", label: "Keyboard and focus" },
    { id: "motion-contrast", label: "Motion and contrast" },
    { id: "manual-review", label: "Manual review" },
  ],
  support: [
    { id: "security-reporting", label: "Security" },
    { id: "contributing", label: "Contributing" },
    { id: "license", label: "MIT license" },
  ],
  licensing: [
    { id: "license", label: "MIT license" },
    { id: "permissions", label: "Permissions" },
    { id: "notices", label: "Notices" },
  ],
};
