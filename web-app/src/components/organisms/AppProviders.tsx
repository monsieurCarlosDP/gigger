"use client";
import { ServiceContextProvider } from "@/context/service-context/ServiceContext";

type Props = {
    children?: React.ReactNode;
}

const AppProviders = ({children}: Props) => {
  return (
    <>
        <ServiceContextProvider>
            {children}
        </ServiceContextProvider>
    </>
  )
}

export default AppProviders