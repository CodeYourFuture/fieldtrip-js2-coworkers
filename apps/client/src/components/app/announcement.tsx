import type { FC } from "react";

export const Announcement: FC<{ message: string }> = (props) => (
  <div className="absolute grid w-full h-full text-lg font-medium place-content-center">
    <div>{props.message}</div>
  </div>
);
