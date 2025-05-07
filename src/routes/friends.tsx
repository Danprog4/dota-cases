import { createFileRoute } from "@tanstack/react-router";
import Lottie from "lottie-react";
import duckAnimation from "~/assets/duck.json";
export const Route = createFileRoute("/friends")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="flex flex-col items-center gap-2 pt-14">
        <div className="h-[150px] w-[150px]">
          <Lottie animationData={duckAnimation} loop={true} />
        </div>
        <div className="text-center text-4xl font-bold">
          Приглашай друзей <br />и получай кристаллы
        </div>
      </div>
    </div>
  );
}
