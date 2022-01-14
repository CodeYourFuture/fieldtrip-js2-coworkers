import type { FC } from "react";
import { Header } from "src/components/app";
import { Container } from "src/components/library";

export const AppLayout: FC = ({ children }) => {
  return (
    <div>
      <Header />
      <main>
        <Container>{children}</Container>
      </main>
    </div>
  );
};
