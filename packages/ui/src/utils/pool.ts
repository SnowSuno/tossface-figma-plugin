import { promiseWithResolvers } from "./promiseWithResolvers";

type AsyncFn<T = void> = () => Promise<T>;

interface Config {
  concurrency: number;
}

export function createStackPool({ concurrency }: Config) {
  const stack: AsyncFn<void>[] = [];
  let running = 0;

  const triggerTask = () => {
    if (running >= concurrency) return;

    const task = stack.pop();
    if (!task) return;

    runTask(task).then(triggerTask);
  };

  const runTask = async (task: AsyncFn<void>) => {
    ++running;
    await task();
    --running;
  };

  return {
    run<T>(fn: AsyncFn<T>): Promise<T> {
      const { promise, resolve, reject } = promiseWithResolvers<T>();

      const task = () =>
        new Promise<void>(resolveTask =>
          fn().then(resolve).catch(reject).finally(resolveTask),
        );

      stack.push(task);
      triggerTask();

      return promise;
    },
  };
}
