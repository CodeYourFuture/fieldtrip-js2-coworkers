import type { FC } from "react";
import type { RouteComponentProps } from "@reach/router";
import { Announcement } from "src/components/app";

export const NotFound: FC<RouteComponentProps> = () => (
  <Announcement message="404" />
);
