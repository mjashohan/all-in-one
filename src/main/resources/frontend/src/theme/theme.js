import { createTheme } from '@mui/material/styles';

// Single source of truth for the app's Material Design palette, typography, and shape.
// When you migrate to React Native later, only this file (and components) need swapping —
// the business logic in /api, /contexts, /hooks, /utils remains portable.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2a5db0',
      light: '#5a82c7',
      dark: '#1e4280',
    },
    secondary: {
      main: '#e74c3c',
      light: '#ff7961',
      dark: '#ba000d',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, system-ui, -apple-system, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
    MuiCard: {
      styleOverrides: {
        root: { transition: 'box-shadow 160ms ease, transform 160ms ease' },
      },
    },
  },
});

export default theme;
