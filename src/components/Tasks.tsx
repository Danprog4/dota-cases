import { useQueryClient } from "@tanstack/react-query";
import { openTelegramLink } from "@telegram-apps/sdk-react";
import { CircleCheck as CheckIcon, Loader2 as Spinner } from "lucide-react";
import { toast } from "sonner";
import { useTasks } from "~/hooks/useTasks";
import { FrontendTask, TaskStatus } from "~/lib/db/schema";
import { useTRPC } from "~/trpc/init/react";
import { Logo } from "./icons/logo";

export const TasksList = () => {
  const trpc = useTRPC();
  const { tasks } = useTasks();
  const queryClient = useQueryClient();
  const { startTask } = useTasks();

  const onGo = (task: FrontendTask) => {
    if (task.status === "completed") {
      return;
    }

    if (!task.taskData) {
      console.log("no task data", task);
      return;
    }

    const channelName =
      task.taskData?.type === "telegram" ? task.taskData.data.channelName : null;

    console.log("channelName", channelName);

    startTask
      .mutateAsync({ taskId: task.id })
      .then(() =>
        queryClient.invalidateQueries({ queryKey: trpc.tasks.getTasks.queryKey() }),
      );

    if (channelName) {
      openTelegramLink(`https://t.me/${channelName}`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {tasks?.map((task) => (
          <div className="flex h-fit w-full items-center justify-start rounded-xl bg-neutral-800 px-4 py-2">
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col">
                <div className="max-w-50">Подписка на DOTA CHANNEL</div>
                <div className="flex items-center gap-2">
                  + {task.reward} <Logo width="20px" height="20px" />
                </div>
              </div>
              {task.status === "notStarted" ? (
                <StartTaskButton onGo={() => onGo(task)} />
              ) : (
                <TaskStatusBlock id={task.id} status={task.status} />
              )}
            </div>
          </div>
        ))}

        {tasks?.length === 0 && (
          <div className="text-muted-foreground flex h-16 items-center justify-center text-sm">
            Нет доступных задач
          </div>
        )}
      </div>
    </div>
  );
};

const StartTaskButton = ({ onGo }: { onGo: () => void }) => {
  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onGo();
  };

  return (
    <div className="rounded-full bg-red-500 px-4 py-2 text-white" onClick={onClick}>
      Подписаться
    </div>
  );
};

const CheckButton = ({ id }: { id: number }) => {
  const { startVerification } = useTasks();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    const old = queryClient.getQueryData(trpc.tasks.getTasks.queryKey());

    if (old?.find((t) => t.id === id)?.status === "checking") {
      toast.error("Задание уже проверяется");
      return;
    }

    try {
      startVerification({ taskId: id });
      queryClient.setQueryData(trpc.tasks.getTasks.queryKey(), (oldTasks) => {
        if (!oldTasks) return oldTasks;

        return oldTasks.map((t) =>
          t.id === id ? { ...t, status: "checking" as TaskStatus } : t,
        );
      });
    } catch {
      toast.error("Не удалось проверить задание");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="rounded-full bg-red-500 px-4 py-2 text-white" onClick={onClick}>
        Проверить
      </div>
    </div>
  );
};

const CompletedTask = () => {
  return (
    <div className="flex aspect-square items-center justify-center rounded-full bg-green-600 p-2 text-white">
      <CheckIcon className="size-4" />
    </div>
  );
};

const TaskStatusBlock = ({ id, status }: { id: number; status: TaskStatus }) => {
  if (status === "started") {
    return <CheckButton id={id} />;
  }

  if (status === "checking") {
    return (
      <button className="flex aspect-square items-center justify-center rounded-full bg-red-500 p-2 text-white">
        <Spinner className="size-4 animate-spin" />
      </button>
    );
  }

  if (status === "failed") {
    return <CheckButton id={id} />;
  }

  if (status === "completed") {
    return <CompletedTask />;
  }

  return null;
};
