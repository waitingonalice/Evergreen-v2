import { Button, Text } from "@waitingonalice/design-system";
import { clientRoutes } from "@/constants";

export function ErrorPage() {
  return (
    <>
      <main className="grid min-h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <Text type="body-bold" className="text-primary-main">
            404
          </Text>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Page not found
          </h1>
          <Text type="body" className="mt-6">
            Sorry, we couldn’t find the page you’re looking for.
          </Text>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button>
              <a href={clientRoutes.dashboard}>Go back home</a>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
