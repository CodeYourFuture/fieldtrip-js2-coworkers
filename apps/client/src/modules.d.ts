import router from "@reach/router";

declare module "@reach/router" {
  export function matchPath(
    path: string,
    uri: string
  ): null | {
    params: Record<string, string>;
    uri: string;
    route: { path: string };
  };
}
