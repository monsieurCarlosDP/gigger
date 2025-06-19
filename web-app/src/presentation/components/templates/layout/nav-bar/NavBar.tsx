import { Checkbox, Stack, styled } from "@mui/material";
import { useEffect } from "react";
import { useThemeContext } from "../../../../context/theme-context/ThemeContext";

const NavBarStyled = styled(Stack)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.primary.light
      : theme.palette.primary.dark,
}));

const NavBar = () => {
  const { toggleTheme, theme } = useThemeContext();

  useEffect(() => {
    console.log(theme);
  }, [theme]);

  return (
    <NavBarStyled>
      <Checkbox onClick={toggleTheme} />
    </NavBarStyled>
  );
};

export default NavBar;
