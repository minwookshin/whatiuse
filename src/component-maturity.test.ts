import { describe, expect, it } from "vitest";
import { componentGuidance } from "./component-guidance";
import { componentMaturity, readyCandidateComponents, readyCandidateIds, readyCriteria } from "./component-maturity";

describe("component maturity contract", () => {
  it("covers every public component once", () => {
    expect(componentMaturity).toHaveLength(Object.keys(componentGuidance).length);
    expect(new Set(componentMaturity.map((component) => component.id)).size).toBe(componentMaturity.length);
  });

  it("records the core RC gate without overstating final readiness", () => {
    expect(readyCandidateComponents.map((component) => component.id)).toEqual(readyCandidateIds);
    expect(readyCandidateComponents.every((component) => component.evidence.startsWith("RC automated gate"))).toBe(true);
    expect(readyCandidateComponents.every((component) => component.nextGate.includes("independent product consumer"))).toBe(true);
    expect(componentMaturity.some((component) => component.status === "Ready")).toBe(false);
    expect(componentMaturity.filter((component) => component.status === "Experimental")).toHaveLength(componentMaturity.length - readyCandidateIds.length);
    expect(readyCriteria.length).toBeGreaterThanOrEqual(6);
  });
});
