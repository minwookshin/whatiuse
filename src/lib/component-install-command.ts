import packageManifest from "../../package.json";

export function getComponentRegistryPath(id: string) {
  return `/r/v/${packageManifest.version}/${id}.json`;
}

export function getComponentInstallCommand(id: string) {
  return `npx shadcn@${packageManifest.devDependencies.shadcn} add ${packageManifest.homepage}${getComponentRegistryPath(id)}`;
}
