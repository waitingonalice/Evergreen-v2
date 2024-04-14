import { QueryClient, QueryClientProvider } from "react-query";
import type { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { cn } from "@waitingonalice/design-system/utils/cn";
import "@/styles/globals.css";
import { isBrowser } from "@/utils";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default function App({ Component, pageProps }: AppContext & AppProps) {
  const isMobilePhone = isBrowser() && window.screen.width < 768;
  const isTablet = isBrowser() && window.screen.width < 1280;
  const renderViewport = () => {
    if (isMobilePhone) {
      return "initial-scale=0.6";
    }
    if (isTablet) {
      return "initial-scale=0.7";
    }
    return "initial-scale=1.0";
  };
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content={cn("width=device-width maximum-scale=1.0", renderViewport())}
        />
        <title>Evergreen</title>
        <link rel="icon" href="/code-bracket.svg" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <main>
          <Component {...pageProps} />
        </main>
      </QueryClientProvider>
    </>
  );
}
