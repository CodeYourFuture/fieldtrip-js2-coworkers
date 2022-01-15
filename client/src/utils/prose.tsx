import type { ComponentType } from "react";

export const prose = (C: ComponentType) => () =>
  (
    <div className="prose">
      <C />
    </div>
  );
