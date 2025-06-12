import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Carousel } from "~/components/Carousel";
import { useTRPC } from "~/trpc/init/react";
export const Route = createFileRoute("/onBoarding")({
  component: RouteComponent,
});

function RouteComponent() {
  const trpc = useTRPC();
  const navigate = useNavigate();

  const onFinish = () => {
    navigate({ to: "/" });
    setOnboarded.mutate();
  };

  const setOnboarded = useMutation(trpc.main.setOnboarded.mutationOptions({}));

  return (
    <div>
      <Carousel onFinish={onFinish} />
    </div>
  );
}
