import { describe, expect, it, vi } from "vitest";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import packageManifest from "../../package.json";
import { publicLibraryItems } from "../component-catalog";
import { extractComponentSources, loadComponentSources } from "./component-registry-source";

const item = {
  files: [
    { path: "registry/components/ui/button.tsx", target: "components/ui/button.tsx", content: "export function Button() {}" },
    { path: "registry/styles/components/button.css", target: "styles/components/button.css", content: ".button {}" },
  ],
};

describe("component registry source", () => {
  it("extracts the installable React and CSS files", () => {
    expect(extractComponentSources(item, "button")).toEqual({
      react: "export function Button() {}",
      css: ".button {}",
    });
  });

  it("loads the immutable versioned registry item", async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify(item), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    }));

    await expect(loadComponentSources("button", { fetcher })).resolves.toEqual({
      react: "export function Button() {}",
      css: ".button {}",
    });
    expect(fetcher).toHaveBeenCalledWith(
      `/r/v/${packageManifest.version}/button.json`,
      expect.objectContaining({ cache: "force-cache", headers: { Accept: "application/json" } }),
    );
  });

  it("rejects incomplete registry items instead of showing the wrong file", () => {
    expect(() => extractComponentSources({ files: item.files.slice(0, 1) }, "button"))
      .toThrow("both React and CSS source");
  });

  it("ships React and CSS source for every public Library component", async () => {
    for (const component of publicLibraryItems) {
      const file = resolve(process.cwd(), "public", "r", "v", packageManifest.version, `${component.id}.json`);
      const registryItem = JSON.parse(await readFile(file, "utf8")) as Parameters<typeof extractComponentSources>[0];
      const sources = extractComponentSources(registryItem, component.id);
      expect(sources.react, `${component.id} React source`).toContain("export");
      expect(sources.css, `${component.id} CSS source`).toContain(".whatiuse-");
    }
  });
});
