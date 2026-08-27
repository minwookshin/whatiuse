import { getComponentRegistryPath } from "./component-install-command";

export type ComponentSourceFile = "react" | "css";
export type ComponentSources = Record<ComponentSourceFile, string>;

type RegistryFile = {
  content?: unknown;
  path?: unknown;
  target?: unknown;
};

type RegistryItem = {
  files?: unknown;
};

function isRegistryFile(value: unknown): value is RegistryFile {
  return Boolean(value && typeof value === "object");
}

function sourceFor(files: readonly RegistryFile[], target: string, fallbackSuffix: string) {
  const file = files.find((item) => item.target === target)
    ?? files.find((item) => typeof item.path === "string" && item.path.endsWith(fallbackSuffix));

  return typeof file?.content === "string" ? file.content : "";
}

export function extractComponentSources(item: RegistryItem, id: string): ComponentSources {
  const files = Array.isArray(item.files) ? item.files.filter(isRegistryFile) : [];
  const react = sourceFor(files, `components/ui/${id}.tsx`, `/ui/${id}.tsx`);
  const css = sourceFor(files, `styles/components/${id}.css`, `/components/${id}.css`);

  if (!react || !css) throw new Error(`Registry item ${id} does not include both React and CSS source.`);
  return { react, css };
}

export async function loadComponentSources(
  id: string,
  options: { signal?: AbortSignal; fetcher?: typeof fetch } = {},
): Promise<ComponentSources> {
  const response = await (options.fetcher ?? fetch)(getComponentRegistryPath(id), {
    cache: "force-cache",
    headers: { Accept: "application/json" },
    signal: options.signal,
  });

  if (!response.ok) throw new Error(`Unable to load registry item ${id} (${response.status}).`);
  return extractComponentSources(await response.json() as RegistryItem, id);
}
