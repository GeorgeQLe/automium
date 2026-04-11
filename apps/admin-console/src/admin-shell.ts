import {
  ADMIN_CONSOLE_SECTIONS,
  adminConsoleGovernanceCapabilities,
} from "./governance-shell";
import {
  GovernanceShellState,
  GovernanceSectionConfig,
  buildGovernanceShellState,
  buildAllSectionConfigs,
  validateGovernanceShellState,
} from "./governance-behavior";

// --- Product constants ---

export const REGISTERED_PRODUCTS = [
  { id: "altitude", label: "Altitude", basePath: "/altitude", description: "Monitoring and observability platform" },
  { id: "switchboard", label: "Switchboard", basePath: "/switchboard", description: "Integration and routing engine" },
  { id: "foundry", label: "Foundry", basePath: "/foundry", description: "Development and deployment toolkit" },
] as const;

// --- Types derived from constants ---

export type ProductId = (typeof REGISTERED_PRODUCTS)[number]["id"];

// --- Interfaces ---

export interface ProductContext {
  activeProductId: ProductId;
  availableProducts: readonly ProductRegistration[];
}

export interface ProductRegistration {
  id: ProductId;
  label: string;
  basePath: string;
  description: string;
}

export interface ProductNavigationConfig {
  currentProduct: ProductRegistration;
  otherProducts: ProductRegistration[];
  switchProductBasePath: string;
}

export interface AdminShellConfig {
  governance: GovernanceShellState;
  sectionConfigs: GovernanceSectionConfig[];
  productContext: ProductContext;
  navigation: ProductNavigationConfig;
  title: string;
}

// --- Builder functions ---

export function resolveActiveProduct(
  productId: ProductId
): ProductRegistration | undefined {
  return REGISTERED_PRODUCTS.find((p) => p.id === productId);
}

export function buildProductNavigationConfig(params: {
  activeProductId: ProductId;
}): ProductNavigationConfig {
  const current = resolveActiveProduct(params.activeProductId);
  if (!current) {
    throw new Error(`Unknown product: ${params.activeProductId}`);
  }

  const otherProducts = REGISTERED_PRODUCTS.filter(
    (p) => p.id !== params.activeProductId
  );

  return {
    currentProduct: current,
    otherProducts: [...otherProducts],
    switchProductBasePath: "/admin/products",
  };
}

export function buildAdminShellConfig(params: {
  activeProductId: ProductId;
  governanceOverrides?: Partial<Parameters<typeof buildGovernanceShellState>[0]>;
  title?: string;
}): AdminShellConfig {
  const governance = buildGovernanceShellState(
    params.governanceOverrides ?? {}
  );
  const sectionConfigs = buildAllSectionConfigs();
  const navigation = buildProductNavigationConfig({
    activeProductId: params.activeProductId,
  });

  const productContext: ProductContext = {
    activeProductId: params.activeProductId,
    availableProducts: REGISTERED_PRODUCTS,
  };

  return {
    governance,
    sectionConfigs,
    productContext,
    navigation,
    title: params.title ?? "Admin Console",
  };
}

// --- Validation ---

export function validateAdminShellConfig(config: AdminShellConfig): string[] {
  const errors: string[] = [];

  // Validate governance state
  errors.push(...validateGovernanceShellState(config.governance));

  // Validate product context
  if (!resolveActiveProduct(config.productContext.activeProductId)) {
    errors.push(
      `Invalid active product: ${config.productContext.activeProductId}`
    );
  }

  // Validate navigation consistency
  if (
    config.navigation.currentProduct.id !==
    config.productContext.activeProductId
  ) {
    errors.push(
      "Navigation current product does not match product context active product"
    );
  }

  // Validate section configs cover all sections
  const configuredSections = new Set(
    config.sectionConfigs.map((sc) => sc.section)
  );
  for (const section of ADMIN_CONSOLE_SECTIONS) {
    if (!configuredSections.has(section)) {
      errors.push(`Missing section config for: ${section}`);
    }
  }

  return errors;
}
