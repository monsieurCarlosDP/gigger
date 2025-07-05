import "./palette.d";

export const colorPaletteLight = {
  /**
   * Basic Colours
   */
  green: {
    main: "#54A17C",
    light: "#C5DED3",
  },
  blue: {
    main: "#2F41ce",
    light: "#9ff5ff",
  },
  violet: {
    main: "#B21DA3",
    light: "#EFE0FF",
    contrastText: "#CE0EBC",
  },
  yellow: {
    main: "#F5BC2D",
    light: "#FFE094",
    dark: "#B88402",
  },
  orange: {
    main: "#EE7D5F",
    light: "#EBC3C3",
  },
  red: {
    main: "#E95757",
    light: "#F29A9A",
  },
  black: {
    main: "#1E1E1E",
  },
  white: {
    main: "#ffffff",
  },
  greySimplified: {
    dark: "#6B7280",
    main: "#E0E0E0",
    light: "#F9F9FB",
  },
};

export const colorPaletteDark = {
  /**
   * Basic Colours - Dark Theme
   */
  green: {
    main: "#3B8C67",
    light: "#70B695",
  },
  blue: {
    main: "#3751FF",
    light: "#6C85FF",
  },
  violet: {
    main: "#9C1790",
    light: "#C05BAF",
    contrastText: "#FFFFFF",
  },
  yellow: {
    main: "#E6AC00",
    light: "#FFDC73",
    dark: "#A67C00",
  },
  orange: {
    main: "#E0663C",
    light: "#FFA487",
  },
  red: {
    main: "#D64545",
    light: "#FF8A8A",
  },
  black: {
    main: "#121212",
  },
  white: {
    main: "#E0E0E0",
  },
  greySimplified: {
    dark: "#2E2E2E",
    main: "#424242",
    light: "#616161",
  },
};

const muiGreyCustomizedLight = {
  grey: {
    50: colorPaletteLight.greySimplified.light,
    100: colorPaletteLight.greySimplified.light,
    200: colorPaletteLight.greySimplified.light,
    300: colorPaletteLight.greySimplified.main,
    400: colorPaletteLight.greySimplified.main,
    500: colorPaletteLight.greySimplified.main,
    600: colorPaletteLight.greySimplified.main,
    700: colorPaletteLight.greySimplified.dark,
    800: colorPaletteLight.greySimplified.dark,
    900: colorPaletteLight.greySimplified.dark,
  },
};

const semanticPaletteLight = {
  /**
   * Semantic Colours
   */
  primary: {
    main: colorPaletteLight.blue.main,
  },
  secondary: {
    main: colorPaletteLight.greySimplified.dark,
    light: colorPaletteLight.greySimplified.light,
  },
  success: {
    main: colorPaletteLight.green.main,
    light: colorPaletteLight.green.light,
  },
  info: {
    main: colorPaletteLight.blue.main,
    light: colorPaletteLight.blue.light,
  },
  warning: {
    main: colorPaletteLight.yellow.dark,
    light: colorPaletteLight.yellow.light,
  },
  error: {
    main: colorPaletteLight.red.main,
    light: colorPaletteLight.red.light,
  },
  lightBackground: {
    main: colorPaletteLight.greySimplified.light,
  },
  divider: colorPaletteLight.greySimplified.main,
  common: {
    white: colorPaletteLight.white.main,
    black: colorPaletteLight.black.main,
  },
};

const muiGreyCustomizedDark = {
  grey: {
    50: colorPaletteDark.greySimplified.light,
    100: colorPaletteDark.greySimplified.light,
    200: colorPaletteDark.greySimplified.light,
    300: colorPaletteDark.greySimplified.main,
    400: colorPaletteDark.greySimplified.main,
    500: colorPaletteDark.greySimplified.main,
    600: colorPaletteDark.greySimplified.main,
    700: colorPaletteDark.greySimplified.dark,
    800: colorPaletteDark.greySimplified.dark,
    900: colorPaletteDark.greySimplified.dark,
  },
};

const semanticPaletteDark = {
  /**
   * Semantic Colours
   */
  primary: {
    main: colorPaletteDark.blue.light,
  },
  secondary: {
    main: colorPaletteDark.violet.main,
    light: colorPaletteDark.violet.light,
  },
  success: {
    main: colorPaletteDark.green.main,
    light: colorPaletteDark.green.light,
  },
  info: {
    main: colorPaletteDark.blue.main,
    light: colorPaletteDark.blue.light,
  },
  warning: {
    main: colorPaletteDark.yellow.dark,
    light: colorPaletteDark.yellow.light,
  },
  error: {
    main: colorPaletteDark.red.main,
    light: colorPaletteDark.red.light,
  },
  lightBackground: {
    main: colorPaletteDark.greySimplified.dark,
  },
  divider: colorPaletteDark.greySimplified.main,
  common: {
    white: colorPaletteDark.white.main,
    black: colorPaletteDark.black.main,
  },
};

export const paletteLight = {
  mode: "light",
  ...colorPaletteLight,
  ...muiGreyCustomizedLight,
  ...semanticPaletteLight,
};

export const paletteDark = {
  mode: "dark",
  ...colorPaletteDark,
  ...muiGreyCustomizedDark,
  ...semanticPaletteDark,
};
