import type { FoundryTheme } from "./foundry-domain";
import { createFoundryTheme } from "./foundry-domain";

export function createTheme(params: {
  applicationId: string;
  name: string;
  tokens: Record<string, string>;
  themeId?: string;
  createdAt?: string;
}): FoundryTheme {
  return createFoundryTheme(params);
}

export function updateFoundryThemeTokens(
  theme: FoundryTheme,
  tokens: Record<string, string>
): FoundryTheme {
  return {
    ...theme,
    tokens: {
      ...theme.tokens,
      ...tokens,
    },
  };
}
