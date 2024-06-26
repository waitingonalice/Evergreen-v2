import { QueryClient, QueryClientProvider } from "react-query";
import type { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { ToastProvider, cn } from "@waitingonalice/design-system/";
import { AppProvider, CustomProps } from "@/components/context";
import { clientRoutes } from "@/constants";
import "@/styles/globals.css";
import { isBrowser } from "@/utils";
import { getUser } from "@/utils/auth";

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
  const renderViewport = () => {
    if (isMobilePhone) {
      return "initial-scale=0.9";
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

  const authRoutes = Object.values(clientRoutes.auth);
  if (authRoutes.includes(ctx.pathname)) {
    return props;
  }

  const user = await getUser(ctx);

  if (!user?.data.result) {
    return props;
  }

  const { result } = user.data;
  return {
    ...props,
    customProps: {
      user: result,
    },
  };
};
