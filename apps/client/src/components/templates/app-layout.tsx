import type { FC } from "react";
import { Header } from "src/components/app";

export const AppLayout: FC = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
};
