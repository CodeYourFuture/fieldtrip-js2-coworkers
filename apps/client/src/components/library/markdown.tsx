import { compiler } from "markdown-to-jsx";
import type { FC } from "react";

export const Markdown: FC<{ children: string }> = ({ children }) => (
  <div className="prose">{compiler(children)}</div>
);
