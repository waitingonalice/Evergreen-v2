import { useEffect, useState } from "react";

export const useDelayUnmount = (isMounted: boolean, delayTime: number) => {
  const [render, setRender] = useState(false);
  useEffect(() => {
    if (isMounted) {
      return setRender(true);
    }
    const timeout = setTimeout(() => setRender(false), delayTime);
    return () => clearTimeout(timeout);
  }, [isMounted]);
  return render;
};
