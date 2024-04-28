import { QueryClient, QueryClientProvider } from "react-query";
import type { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { ToastProvider, cn } from "@waitingonalice/design-system/";
import { AppProvider } from "@/components/context";
import "@/styles/globals.css";
import { isBrowser } from "@/utils";
import { UserResponse, getUser } from "@/utils/auth";

export interface CustomProps {
  customProps: {
    user: UserResponse["result"];
  };
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default function App({
  Component,
  pageProps,
  customProps,
}: AppContext & AppProps & CustomProps) {
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
      <AppProvider customProps={customProps}>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <Component {...pageProps} />
          </ToastProvider>
        </QueryClientProvider>
      </AppProvider>
    </>
  );
}

App.getInitialProps = async ({ Component, ctx, router }: AppContext) => {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  const props = {
    pageProps,
    Component,
    router,
  };
  const user = await getUser(ctx);
  if (!user?.data.result) return props;
  const { result } = user.data;

  return {
    ...props,
    customProps: {
      user: result,
    },
  };
};
