import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { IntlProvider } from "react-intl";
import { messages } from "../../intl/messages";

interface ILocalizationContext {
  language: TLocales;
  setLanguage: Dispatch<SetStateAction<TLocales>>;
  locales: Record<string, string>;
}

const LocationContext = createContext<ILocalizationContext | null>(null);
export type TLocales = "es" | "en";
const locales: Record<string, TLocales> = {
  es: "es",
  en: "en",
};
export const LocalizationProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [language, setLanguage] = useState<TLocales>(locales.es);
  const context: ILocalizationContext = {
    language,
    setLanguage,
    locales,
  };
  return (
    <LocationContext.Provider value={context}>
      <IntlProvider
        locale={language}
        messages={messages[language]}
        defaultLocale={locales.es}
      >
        {children}
      </IntlProvider>
    </LocationContext.Provider>
  );
};

export const useLocalizationTools = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error(
      "useLocalizationTools must be used within a LocalizationContextProvider!"
    );
  }
  return context;
};
