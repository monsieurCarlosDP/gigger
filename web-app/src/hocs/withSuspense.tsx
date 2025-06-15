import { Backdrop } from "@mui/material";
import { forwardRef, Suspense } from "react";

export const withSuspense = <P extends object, T extends object>(
  Component: React.ComponentType<P>,
  LoadingComponent?: React.ReactNode
) => {
  const EnhancedComponentWithSuspenseAndRefSupport: React.ForwardRefRenderFunction<
    T,
    React.PropsWithoutRef<P>
  > = (props, ref) => (
    <Suspense
      fallback={
        LoadingComponent ?? (
          <Backdrop
            open={true}
            sx={{
              zIndex: 1500,
              backgroundColor: "rgba(0, 0, 0, 0.1)",
            }}
          />
        )
      }
    >
      <Component ref={ref} {...(props as P)} />
    </Suspense>
  );

  return forwardRef(EnhancedComponentWithSuspenseAndRefSupport);
};
