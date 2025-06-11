import { useQuery } from "@tanstack/react-query";
import { useTasks } from "~/hooks/useTasks";
import { useTRPC } from "~/trpc/init/react";
import { Logo } from "./icons/logo";
import { TaskStatusBlock } from "./Tasks";
export const CompletedTasks = () => {
  const { tasks } = useTasks();
  const trpc = useTRPC();
  const { data: friends } = useQuery(trpc.main.getFriends.queryOptions());

  return (
    <div className="flex flex-col gap-2">
      <div className="opacity-50">Выполненные задания</div>
      {tasks
        ?.filter((t) => t.status === "completed")
        .map((task, index) => (
          <div
            key={index}
            className="flex h-fit w-full items-center justify-start rounded-xl bg-neutral-800 px-4 py-2"
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col">
                <div className="max-w-50 text-nowrap">Подписка на DOTA CHANNEL</div>
                <div className="flex items-center gap-2">
                  + {task.reward} <Logo width="20px" height="20px" />
                </div>
              </div>
              <TaskStatusBlock id={task.id} status={task.status} />
            </div>
          </div>
        ))}
      {friends?.map((friend) => (
        <div
          key={friend.id}
          className="flex h-fit w-full items-center justify-start rounded-xl bg-neutral-800 px-4 py-2"
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col">
              <div className="max-w-50 text-nowrap">Приглашен друг {friend.name}</div>
              <div className="flex items-center gap-2">
                + 500 <Logo width="20px" height="20px" />
              </div>
            </div>
            <TaskStatusBlock id={friend.id} status={"completed"} />
          </div>
        </div>
      ))}

      {tasks?.length === 0 && friends?.length === 0 && (
        <div className="flex h-14 w-full items-center justify-start rounded-xl bg-neutral-800 p-4">
          <div>Заданий пока нет</div>
        </div>
      )}
    </div>
  );
};
