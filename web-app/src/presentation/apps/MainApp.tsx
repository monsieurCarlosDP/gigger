import { Route, Routes } from "react-router";
import { TextField } from "../components/atoms/TextField/TextField";
import Header from "../components/templates/layout/header/Header";
import NavBar from "../components/templates/layout/nav-bar/NavBar";
import PageLayout from "../components/templates/layout/PageLayout";
import { PageLayoutContextProvider } from "../context/page-layout-context/PageLayoutContext";

const MainApp = () => {
  return (
    <PageLayoutContextProvider>
      <Routes>
        <Route
          path="*"
          element={
            <PageLayout
              headerComponent={<Header />}
              bodyComponent={
                <Routes>
                  <Route>
                    <Route path="*" element={<TextField />} index />
                  </Route>
                  <Route path="esto-es-una-prueba-2">
                    <Route path="*" element={<h1>Probando2</h1>} index />
                  </Route>
                </Routes>
              }
              navBarComponent={<NavBar />}
              sideComponent={
                <div>
                  <h3>Side</h3>
                </div>
              }
            />
          }
        ></Route>
      </Routes>
    </PageLayoutContextProvider>
  );
};

export default MainApp;
