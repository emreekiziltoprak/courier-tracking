import { ModuleRegistry, AllCommunityModule, themeBalham } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

const DARK_THEME_PARAMS = {
  backgroundColor: "#2b2b2b",
  foregroundColor: "#ffffff",
  headerBackgroundColor: "#363636",
  headerTextColor: "#9e9e9e",
  rowHoverColor: "#404040",
  borderColor: "#545454",
  columnBorder: false,
  headerColumnBorder: false,
  fontSize: 12,
  fontFamily: "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
} as const;

export const gridDarkTheme = themeBalham.withParams({
  ...DARK_THEME_PARAMS,
  rowHeight: 46,
  headerHeight: 36,
  selectedRowBackgroundColor: "rgba(0,154,242,0.12)",
});

export const gridDarkThemeCompact = themeBalham.withParams({
  ...DARK_THEME_PARAMS,
  rowHeight: 40,
  headerHeight: 32,
});

export const gridDarkThemeLogs = themeBalham.withParams({
  ...DARK_THEME_PARAMS,
  rowHeight: 42,
  headerHeight: 34,
});
