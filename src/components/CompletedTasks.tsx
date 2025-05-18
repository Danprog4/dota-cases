import { useTasks } from "~/hooks/useTasks";
import { Logo } from "./icons/logo";
import { TaskStatusBlock } from "./Tasks";

export const CompletedTasks = () => {
  const { tasks } = useTasks();

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
                <div className="max-w-50">Подписка на DOTA CHANNEL</div>
                <div className="flex items-center gap-2">
                  + {task.reward} <Logo width="20px" height="20px" />
                </div>
              </div>
              <TaskStatusBlock id={task.id} status={task.status} />
            </div>
          </div>
        ))}

      {tasks?.length === 0 && (
        <div className="flex h-14 w-full items-center justify-start rounded-xl bg-neutral-800 p-4">
          <div>Заданий пока нет</div>
        </div>
      )}
    </div>
  );
};
