import { Checkbox, Stack, styled, type StackProps } from "@mui/material";
import { useState } from "react";
import {
  useLocalizationTools,
  type TLocales,
} from "../../../../context/localization-context/LocalizationProvider";
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
    duration: 250,
    easing: "ease-in-out",
  }),
  borderRight: 4,
  borderColor:
    theme.palette.mode === "light"
      ? theme.palette.black.main
      : theme.palette.greySimplified.main,
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.lightBackground.main
      : theme.palette.lightBackground.main,
}));

const NavBar = () => {
  const { toggleTheme, theme } = useThemeContext();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const { language, locales, setLanguage } = useLocalizationTools();
  const toggleCollapse = () => {
    setCollapsed((prevState) => !prevState);
  };
  const toggleLanguage = () => {
    setLanguage(
      (prevLang: TLocales): TLocales =>
        (prevLang === locales.es ? locales.en : locales.es) as TLocales
    );
  };

  return (
    <NavBarStyled collapsed={collapsed}>
      aa
      <NavBarHeaderStyled collapsed></NavBarHeaderStyled>
      <NavBarBodyStyled collapsed></NavBarBodyStyled>
      <NavBarFooterStyled collapsed>
        <Checkbox onClick={toggleTheme} />
        <Checkbox checked={collapsed} onClick={toggleCollapse} />
        <Checkbox checked={language === locales.es} onClick={toggleLanguage} />
      </NavBarFooterStyled>
    </NavBarStyled>
  );
};

export default NavBar;
