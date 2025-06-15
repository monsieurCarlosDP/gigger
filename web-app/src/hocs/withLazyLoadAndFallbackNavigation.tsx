import React, { type ComponentType } from "react";

const IMPORTING_LAZY_COMPONENT_ERROR_QUERY_PARAM =
  "importing-lazy-component-error";

function handleSuccesfulPostback(): void {
  const currentUrl = new URL(window.location.href);
  if (
    !currentUrl.searchParams.has(IMPORTING_LAZY_COMPONENT_ERROR_QUERY_PARAM)
  ) {
    console.debug("lazy loading of dynamic import [succesful]");
    return;
  }

  console.warn(
    "A postback navigation was forced successfully due to error fetching a lazy component dynamic import.",
    {
      level: "warning",
      extra: {
        errorMessage: currentUrl.searchParams.get(
          IMPORTING_LAZY_COMPONENT_ERROR_QUERY_PARAM
        ),
      },
    }
  );

  // Update the URL in the browser's address bar without reloading the page
  console.warn(
    "lazy loading of dynamic import after postback reload [succesful]"
  );
  currentUrl.searchParams.delete(IMPORTING_LAZY_COMPONENT_ERROR_QUERY_PARAM);
  window.history.replaceState(null, "", currentUrl.toString());
}

export default function withLazyLoadAndFallbackNavigation<P = unknown>(
  dynamicImport: () => Promise<{ default: ComponentType<P> }>
) {
  return React.lazy(() =>
    dynamicImport()
      .catch((error) => {
        const errorMessage: string =
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message: string }).message
            : "error";

        const postBackURL = new URL(window.location.href);
        if (
          postBackURL.searchParams.has(
            IMPORTING_LAZY_COMPONENT_ERROR_QUERY_PARAM
          )
        ) {
          throw new Error(
            "Error navigating after trying to postback to recover from lazy load a component failure"
          );
        }

        postBackURL.searchParams.set(
          IMPORTING_LAZY_COMPONENT_ERROR_QUERY_PARAM,
          errorMessage
        );
        window.location.href = postBackURL.toString();
        return { default: () => <></> };
      })
      .then((loadedComponent) => {
        handleSuccesfulPostback();
        return loadedComponent;
      })
  );
}
