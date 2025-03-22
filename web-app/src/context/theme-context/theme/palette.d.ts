import { SimplePaletteColorOptions } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    black: SimplePaletteColorOptions;
    white: SimplePaletteColorOptions;

    violet: SimplePaletteColorOptions;
    orange: SimplePaletteColorOptions;
    yellow: SimplePaletteColorOptions;
    green: SimplePaletteColorOptions;
    blue: SimplePaletteColorOptions;
    red: SimplePaletteColorOptions;
    greySimplified: SimplePaletteColorOptions;

    lightBackground: SimplePaletteColorOptions;
  }
  interface PaletteOptions {
    black: SimplePaletteColorOptions;
    white: SimplePaletteColorOptions;

    violet: SimplePaletteColorOptions;
    orange: SimplePaletteColorOptions;
    yellow: SimplePaletteColorOptions;
    green: SimplePaletteColorOptions;
    blue: SimplePaletteColorOptions;
    red: SimplePaletteColorOptions;
    greySimplified: SimplePaletteColorOptions;

    lightBackground: SimplePaletteColorOptions;
  }
}

declare module '@mui/material/Chip' {
  export interface ChipPropsColorOverrides {
    violet: true;
  }
}
declare module '@mui/material/SvgIcon' {
  export interface SvgIconPropsColorOverrides {
    violet: true;
  }
}

declare module '@mui/material/IconButton' {
  export interface IconButtonPropsColorOverrides {
    violet: true;
  }
}
