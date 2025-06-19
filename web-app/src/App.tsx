import "./App.css";
import WebAppRootEntryPoint from "./presentation/components/WebAppRootEntryPoint";
import AppProviders from "./presentation/context/app-provider/AppProviders";

function App() {
  return (
    <>
      <AppProviders>
        <WebAppRootEntryPoint />
      </AppProviders>
    </>
  );
}

export default App;
