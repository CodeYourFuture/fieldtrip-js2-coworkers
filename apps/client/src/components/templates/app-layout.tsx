import type { FC } from "react";
import { Header } from "src/components/app";

export const AppLayout: FC = ({ children }) => {
  return (
    <div className="mb-16">
      <Header />
      <main>{children}</main>
    </div>
  );
};
