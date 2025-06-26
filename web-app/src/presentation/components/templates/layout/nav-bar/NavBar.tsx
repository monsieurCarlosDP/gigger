import { Checkbox, Stack, styled, type StackProps } from "@mui/material";
import { useEffect, useState } from "react";
import { useThemeContext } from "../../../../context/theme-context/ThemeContext";

interface INavBarStyled extends StackProps {
  collapsed: boolean;
}

const NavBarHeaderStyled = styled(Stack, {
  shouldForwardProp: (prop) => prop !== "collapsed",
})<INavBarStyled>(({ theme, collapsed }) => ({
  display: "flex",
  justifyContent: "center",
  height: "15%",
}));
const NavBarFooterStyled = styled(Stack, {
  shouldForwardProp: (prop) => prop !== "collapsed",
})<INavBarStyled>(({ theme, collapsed }) => ({
  display: "flex",
  justifyContent: "space-around",
  height: "25%",
}));
const NavBarBodyStyled = styled(Stack, {
  shouldForwardProp: (prop) => prop !== "collapsed",
})<INavBarStyled>(({ theme, collapsed }) => ({
  display: "flex",
  justifyContent: "center",
  flexGrow: 1,
}));

const NavBarStyled = styled(Stack, {
  shouldForwardProp: (prop) => prop !== "collapsed",
})<INavBarStyled>(({ theme, collapsed }) => ({
  width: collapsed ? "5vw" : "15vw",
  overflow: "hidden",
  transition: theme.transitions.create(["width", "backgroundColor"], {
    duration: 100,
    easing: "ease-in-out",
  }),
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.primary.light
      : theme.palette.primary.dark,
}));

const NavBar = () => {
  const { toggleTheme, theme } = useThemeContext();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const toggleCollapse = () => {
    setCollapsed((prevState) => !prevState);
  };

  useEffect(() => {
    console.log(theme);
  }, [theme]);

  return (
    <NavBarStyled collapsed={collapsed}>
      <NavBarHeaderStyled collapsed></NavBarHeaderStyled>
      <NavBarBodyStyled collapsed></NavBarBodyStyled>
      <NavBarFooterStyled collapsed>
        <Checkbox onClick={toggleTheme} />
        <Checkbox checked={collapsed} onClick={toggleCollapse} />
      </NavBarFooterStyled>
    </NavBarStyled>
  );
};

export default NavBar;
