import { styled, type StackProps } from "@mui/material";
import { usePageLayoutContext } from "../../../context/page-layout-context/PageLayoutContext";
const PAGE_LAYOUT_MAIN_CONTENT_MAX_WIDTH = 1724;

export interface IPageLayoutProps {
  children?: React.ReactNode;
  navBarComponent: React.ReactNode;
  headerComponent: React.ReactNode;
  bodyComponent: React.ReactNode;
  sideComponent: React.ReactNode;
}

interface IStackProps extends StackProps {
  component?: React.ElementType;
}

const LayoutRoot = styled("div")<IStackProps>({
  display: "flex",
  width: "100vw",
  height: "100vh",
  overflow: "hidden",
});

const Main = styled("main")<IStackProps>(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minHeight: 0,
  minWidth: "400px", // force shrink behaviour in main content of the app. Forces scroll appearence to handle overflows when the width is too small.
  height: "100vh",
  alignItems: "center",
  color: theme.palette.text.primary,
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.lightBackground.main
      : theme.palette.lightBackground.main,
}));

const Aside = styled("aside")<IStackProps>({
  display: "flex",
  height: "100vh",
  width: "25%",
  minWidth: "360px",
  maxWidth: "480px",
});

const Nav = styled("nav")({
  display: "flex",
  height: "100vh",
});

const ContentHeader = styled("header")<IStackProps>(({ theme }) => ({
  display: "flex",
  width: "100%",
  flexGrow: 1,
  maxWidth: PAGE_LAYOUT_MAIN_CONTENT_MAX_WIDTH,
  paddingBottom: 0,
}));

const Content = styled("div")<IStackProps>(({ theme }) => ({
  display: "flex",
  width: "100%",
  maxWidth: PAGE_LAYOUT_MAIN_CONTENT_MAX_WIDTH,
  height: "100%",
  minHeight: 0,
  paddingTop: 0,
}));

const PageLayout = ({
  children,
  navBarComponent: NavBarComponent,
  headerComponent: HeaderComponent,
  bodyComponent: BodyComponent,
  sideComponent: SideComponent,
}: IPageLayoutProps) => {
  // Crear contexto compartido para abrir sidepanel
  const { sidePanel } = usePageLayoutContext();
  const { isSidePanelOpen } = sidePanel;
  return (
    <LayoutRoot>
      <Nav>{NavBarComponent}</Nav>
      <Main>
        <ContentHeader>{HeaderComponent}</ContentHeader>
        <Content>
          {BodyComponent}
          {children}
        </Content>
      </Main>
      {isSidePanelOpen && <Aside>{SideComponent}</Aside>}
    </LayoutRoot>
  );
};

export default PageLayout;
