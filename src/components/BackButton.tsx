import { backButton, useSignal } from "@telegram-apps/sdk-react";
import { useEffect } from "react";

type BackButtonProps = {
  onClick: () => void;
};

export function BackButton({ onClick }: BackButtonProps) {
  const isVisible = useSignal(backButton.isVisible);

  useEffect(() => {
    console.log("The button is", isVisible ? "visible" : "invisible");
  }, [isVisible]);

  useEffect(() => {
    backButton.show();
    backButton.onClick(onClick);
    return () => {
      backButton.hide();
    };
  }, []);

  return null;
}
