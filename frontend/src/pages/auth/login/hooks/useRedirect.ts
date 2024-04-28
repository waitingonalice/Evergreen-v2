import { useEffect } from "react";
import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";
import { ToastContextBaseProps, useToast } from "@waitingonalice/design-system";
import { clientRoutes } from "@/constants";

export const useRedirect = () => {
  const router = useRouter();
  const { renderToast } = useToast();
  useEffect(() => {
    const status = router.query["verify-status"];
    const { expired } = router.query;
    const toastProps: ToastContextBaseProps = {
      show: true,
      key: uuid(),
      variant: "success",
      title: "",
      position: "top-right",
    };
    if (expired || status) {
      if (expired === "true") {
        renderToast({
          ...toastProps,
          variant: "error",
          title: "Session expired, please login again",
        });
      } else if (status === "ok") {
        renderToast({
          ...toastProps,
          title: "Email was successfully verified",
        });
      } else if (status === "error") {
        renderToast({
          ...toastProps,
          variant: "error",
          title: "Error verifying email",
        });
      }
      router.replace(clientRoutes.auth.login, undefined, { shallow: true });
    }
  }, [router.query]);
};
