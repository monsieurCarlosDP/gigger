import {
  type Theme,
  ThemeProvider as MUIThemeProvider,
  createTheme,
} from "@mui/material";
import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { breakpoints } from "./theme/Breakpoints";
import { paletteDark, paletteLight } from "./theme/Palette";

type TGiggerTheme = "light" | "dark";

interface ThemeContextProps {
  giggerTheme: Theme;
  theme: TGiggerTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeContextProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<TGiggerTheme>("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const giggerTheme = useMemo(
    () =>
      createTheme({
        breakpoints: breakpoints,
        spacing: 4,

        palette: {
          ...(theme === "light" ? paletteLight : paletteDark),
          mode: theme,
        },
      }),

    [theme]
  );

  return (
    <ThemeContext.Provider value={{ giggerTheme, theme, toggleTheme }}>
      <MUIThemeProvider theme={giggerTheme}>{children}</MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};
