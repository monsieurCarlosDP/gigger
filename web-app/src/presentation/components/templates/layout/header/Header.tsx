import { Stack, styled } from "@mui/material";
import type { PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";
import { Route, Routes } from "react-router";

const HeaderRootStyled = styled(Stack)(({ theme }) => ({}));

const Header = ({ children }: PropsWithChildren) => {
  return (
    <HeaderRootStyled>
      <Routes>
        <Route>
          <Route
            path="*"
            element={
              <>
                <FormattedMessage
                  id="dashboardTitle"
                  defaultMessage="Dashboard"
                />
              </>
            }
            index
          />
        </Route>
        <Route path="esto-es-una-prueba-2">
          <Route path="*" element={<h1>Probando2</h1>} index />
        </Route>
      </Routes>
    </HeaderRootStyled>
  );
};

export default Header;
