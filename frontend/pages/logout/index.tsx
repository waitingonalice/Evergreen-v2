import { useEffect } from "react";
import { useRouter } from "next/router";
import { Spinner, Text } from "@waitingonalice/design-system";
import { clientRoutes } from "@/constants";
import { removeCookieTokens } from "@/utils";
import "@/utils/auth";

function Logout() {
  const router = useRouter();
  removeCookieTokens();

  useEffect(() => {
    setTimeout(() => {
      router.replace(clientRoutes.auth.login);
    }, 500);
  }, []);

  return (
    <div className="h-screen w-screen flex items-center justify-center gap-x-2">
      <Spinner />
      <Text type="subhead-2-bold" className="text-secondary-1">
        Logging out...
      </Text>
    </div>
  );
}

export default Logout;
