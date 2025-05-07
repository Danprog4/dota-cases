import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Lottie from "lottie-react";
import duckAnimation from "~/assets/duck.json";
import { BackButton } from "~/components/BackButton";
export const Route = createFileRoute("/friends")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex flex-col items-center gap-2 p-4 pt-14">
        <BackButton onClick={() => navigate({ to: "/" })} />
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
