'use client';

import { ThemeContextProvider, useThemeContext } from "@/context/theme-context/ThemeContext";


export default function Home() {

  const { theme } = useThemeContext();

  return (
    <div>
        <ThemeContextProvider>
            <h1>{theme}</h1>
        </ThemeContextProvider>
    </div>
  );
}
