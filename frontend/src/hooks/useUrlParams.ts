import { useRouter } from "next/router";

/**
 * Hook to handle updating URL params for data fetching.
 */
export const useUrlParams = () => {
  const router = useRouter();
  const updateUrl = <T extends Record<string, any>>(arg?: T) => {
    const formatInput = Object.entries(arg ?? {});
    const url = new URLSearchParams(window.location.search);
    formatInput.forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") {
        url.delete(k);
      } else {
        url.set(k, v);
      }
    });
    router.push({ search: url.toString() }, undefined, { shallow: true });
  };

  return {
    updateUrl,
  };
};
