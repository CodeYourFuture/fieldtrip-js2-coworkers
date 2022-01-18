import {
  globalHistory,
  matchPath,
  navigate,
  NavigateOptions,
  History,
} from "@reach/router";

export const router = {
  navigate(path: string, opts?: NavigateOptions<{}>) {
    navigate(path, opts);
  },
  replace(path: string, opts: Omit<NavigateOptions<{}>, "replace"> = {}) {
    navigate(path, { replace: true, ...opts });
  },
  location(history = globalHistory) {
    return history.location;
  },
  async listen(subscriber: (...args: any) => void) {
    const onRouteChange = async (history: History) => {
      await subscriber(router.location(history));
    };
    await onRouteChange(globalHistory);
    globalHistory.listen((history) => onRouteChange(history as any));
  },

  async match(path: string, subscriber: (...args: any) => void) {
    await router.listen(async (args) => {
      const match = matchPath(path, args.pathname);
      if (match) {
        await subscriber(match);
      }
    });
  },
};
