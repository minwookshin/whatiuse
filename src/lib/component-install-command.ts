import packageManifest from "../../package.json";

// The published site currently does not serve /r. Pin the installable snapshot
// to the commit that contains the rc.43 registry artifacts.
const registryRevision = "76c5542112152432fbf914121d10d0d9ac531c9d";
const registryRoot = `https://raw.githubusercontent.com/minwookshin/whatiuse/${registryRevision}/public/r/v/${packageManifest.version}`;

export function getPinnedRegistryTemplate() {
  return `${registryRoot}/{name}.json`;
}

export function getComponentRegistryUrl(id: string) {
  return `${registryRoot}/${id}.json`;
}

export function getComponentInstallCommand(id: string) {
  const cli = `npx shadcn@${packageManifest.devDependencies.shadcn}`;
  return `${cli} registry add @whatiuse=${getPinnedRegistryTemplate()}\n${cli} add @whatiuse/${id}`;
}
