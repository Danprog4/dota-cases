import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export const FullPageSpinner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-white" />
    </div>
  );
};
