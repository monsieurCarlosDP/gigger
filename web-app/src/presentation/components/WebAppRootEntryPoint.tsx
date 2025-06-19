import { BrowserRouter, Route, Routes } from "react-router";
import withLazyLoadAndFallbackNavigation from "../../hocs/withLazyLoadAndFallbackNavigation";
import { withSuspense } from "../../hocs/withSuspense";

const MainAppLazy = withSuspense(
  withLazyLoadAndFallbackNavigation(
    () => import("../../presentation/apps/MainApp")
  )
);

const WebAppRootEntryPoint = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<MainAppLazy />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default WebAppRootEntryPoint;
