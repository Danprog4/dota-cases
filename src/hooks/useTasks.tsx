import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { TaskStatus } from "~/lib/db/schema";
import { useTRPC } from "~/trpc/init/react";

export const useTasks = () => {
  const trpc = useTRPC();
  const { data: tasks } = useQuery(
    trpc.tasks.getTasks.queryOptions(undefined, {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
    }),
  );
  const queryClient = useQueryClient();

  const { mutateAsync: startVerification } = useMutation(
    trpc.tasks.startVerification.mutationOptions({}),
  );

  const startTask = useMutation(
    trpc.tasks.startTask.mutationOptions({
      onSuccess: (_, { taskId }) => {
        queryClient.setQueryData(trpc.tasks.getTasks.queryKey(), (oldTasks) => {
          if (!oldTasks) return oldTasks;

          return oldTasks.map((t) =>
            t.id === taskId ? { ...t, status: "started" as TaskStatus } : t,
          );
        });
      },
    }),
  );

  return {
    tasks,
    startVerification,
    startTask,
  };
};

export function useTaskStatusPolling() {
  const trpc = useTRPC();
  const { data: tasks } = useQuery(trpc.tasks.getTasks.queryOptions());
  const queryClient = useQueryClient();

  const checkingTaskIds = tasks
    ?.filter((t) => t.status !== "notStarted" && t.status !== "completed")
    .map((t) => t.id);

  console.log("checkingTaskIds", checkingTaskIds);

  const { data: statuses } = useQuery(
    trpc.tasks.getTasksStatuses.queryOptions(
      {
        tasksIds: checkingTaskIds ?? [],
      },
      {
        refetchInterval: 5000,
      },
    ),
  );

  const updateTaskStatus = (taskId: number, status: TaskStatus) => {
    queryClient.setQueryData(trpc.tasks.getTasks.queryKey(), (oldTasks) => {
      if (!oldTasks) return oldTasks;

      return oldTasks.map((task) => (task.id === taskId ? { ...task, status } : task));
    });
  };

  console.log("statuses polling", statuses);

  useEffect(() => {
    if (!statuses) {
      return;
    }

    statuses.forEach(({ taskId, status }) => {
      if (status === "completed") {
        updateTaskStatus(taskId, "completed");
        queryClient.invalidateQueries({ queryKey: trpc.tasks.getTasks.queryKey() });
        toast.success(`Task is completed`, { id: "task-completed" });
      } else if (status === "failed") {
        updateTaskStatus(taskId, "notStarted");
        toast.error(`Task is not completed, try again`, { id: "task-failed" });
      }
    });
  }, [queryClient, statuses, trpc.tasks.getTasks, updateTaskStatus]);

  return null;
}
