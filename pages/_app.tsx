import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { MantineThemeOverride, MantineProvider } from "@mantine/core";

const liftLogTheme: MantineThemeOverride = {
  colorScheme: "dark",
  primaryColor: "orange",
  defaultRadius: 0,
  fontFamily: "Open Sans",
};

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <MantineProvider theme={liftLogTheme} withGlobalStyles withNormalizeCSS>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </MantineProvider>
  );
};

export default App;
