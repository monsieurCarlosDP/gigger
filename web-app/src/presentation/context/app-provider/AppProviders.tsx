import { LocalizationProvider } from "../localization-context/LocalizationProvider";
import { ServiceContextProvider } from "../service-context/ServiceContext";
import { ReactQueryContextProvider } from "../tanstack-query-context/ReactQueryContext";
import ReactQuerySetupSingleton from "../tanstack-query-context/ReactQuerySetupSingleton";
import { ThemeContextProvider } from "../theme-context/ThemeContext";

type Props = {
  children?: React.ReactNode;
};

const AppProviders = ({ children }: Props) => {
  return (
    <>
      <ServiceContextProvider>
        <ThemeContextProvider>
          <ReactQueryContextProvider
            reactQuerySetupSingleton={ReactQuerySetupSingleton.getInstance()}
          >
            <LocalizationProvider>{children}</LocalizationProvider>
          </ReactQueryContextProvider>
        </ThemeContextProvider>
      </ServiceContextProvider>
    </>
  );
};

export default AppProviders;
