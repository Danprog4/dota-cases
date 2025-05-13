import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useUser } from "~/hooks/useUser";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useUser();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center gap-2 p-4 pt-14">
      <div className="flex flex-col items-center gap-2">
        <div className="aspect-square w-32 rounded-full bg-neutral-800">
          <img
            src={user?.photoUrl || ""}
            alt=""
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div className="text-2xl font-bold">{user?.name}</div>
      </div>
      <div className="mt-8 flex w-full flex-col items-start rounded-xl bg-neutral-800">
        <div className="flex w-full items-center justify-between p-4">
          <div>Ссылка обмена</div>
          <div>
            <ChevronRight />
          </div>
        </div>
      </div>
    </div>
  );
}
