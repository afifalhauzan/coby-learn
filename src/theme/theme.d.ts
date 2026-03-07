import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    heatmap: {
      level1: { main: string };
      level2: { main: string };
      level3: { main: string };
      level4: { main: string };
      level5: { main: string };
    };
  }

  interface ThemeOptions {
    heatmap?: {
      level1?: { main?: string };
      level2?: { main?: string };
      level3?: { main?: string };
      level4?: { main?: string };
      level5?: { main?: string };
    };
  }
}
