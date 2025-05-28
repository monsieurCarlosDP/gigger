"use client";
import { ServiceContextProvider } from "../../../context/service-context/ServiceContext";
import { ReactQueryContextProvider } from "../../../context/tanstack-query-context/ReactQueryContext";
import ReactQuerySetupSingleton from "../../../context/tanstack-query-context/ReactQuerySetupSingleton";

type Props = {
    children?: React.ReactNode;
}

const AppProviders = ({children}: Props) => {
  return (
    <>
        <ServiceContextProvider>
          <ReactQueryContextProvider reactQuerySetupSingleton={ReactQuerySetupSingleton.getInstance()}>
            {children}
          </ReactQueryContextProvider>
        </ServiceContextProvider>
    </>
  )
}

export default AppProviders