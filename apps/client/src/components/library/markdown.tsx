import { compiler } from "markdown-to-jsx";
import type { FC } from "react";

export const Markdown: FC<{ children: string; prose?: boolean }> = ({
  children,
  prose = true,
}) => {
  if (prose) {
    return <div className="prose">{compiler(children)}</div>;
  }
  return compiler(children);
};
