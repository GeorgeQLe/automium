import type { CustomWidgetPackage } from "./foundry-domain";
import { createFoundryCustomWidgetPackage } from "./foundry-domain";

export interface FoundryCustomWidgetRegistry {
  register(input: {
    packageName: string;
    version: string;
    runtimeEntry: string;
    editorEntry: string;
    allowedProperties: string[];
    customWidgetPackageId?: string;
    createdAt?: string;
  }): CustomWidgetPackage;
  list(): CustomWidgetPackage[];
  getRuntimeEntry(customWidgetPackageId: string): string | undefined;
}

export function createFoundryCustomWidgetRegistry(
  initialPackages: CustomWidgetPackage[] = []
): FoundryCustomWidgetRegistry {
  const packages = new Map(
    initialPackages.map((pkg) => [pkg.customWidgetPackageId, pkg])
  );

  return {
    register(input) {
      const pkg = createFoundryCustomWidgetPackage(input);
      packages.set(pkg.customWidgetPackageId, pkg);
      return pkg;
    },
    list() {
      return [...packages.values()];
    },
    getRuntimeEntry(customWidgetPackageId) {
      return packages.get(customWidgetPackageId)?.runtimeEntry;
    },
  };
}
