import { createContext, useContext, useState } from "react";

interface ISidePanelInteraction {
  isSidePanelOpen: boolean;
  toggleSidePanel: () => void;
}

const useSidePanelInteraction = (): ISidePanelInteraction => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);

  const toggleSidePanel = () =>
    setIsSidePanelOpen((prevState: boolean) => !prevState);

  return {
    isSidePanelOpen,
    toggleSidePanel,
  };
};

export const PageLayoutContext = createContext<IPageLayoutContext | null>(null);

export interface IPageLayoutContext {
  sidePanel: ISidePanelInteraction;
}

export const PageLayoutContextProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const sidePanel = useSidePanelInteraction();

  const context: IPageLayoutContext = {
    sidePanel,
  };

  return (
    <PageLayoutContext.Provider value={context}>
      {children}
    </PageLayoutContext.Provider>
  );
};

export const usePageLayoutContext = (): IPageLayoutContext => {
  const context = useContext(PageLayoutContext);
  if (!context) {
    throw new Error(
      "usePageLayoutContext must be used within a PageLayoutContextProvider. Wrap a parent component in <PageLayoutContextProvider> to fix this error."
    );
  }
  return context;
};
