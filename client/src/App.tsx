import type { FC } from "react";
import { useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { H1, ExternalLink } from "@djgrant/components";

type User = {
  data: any;
};

export const App: FC<RouteComponentProps> = () => {
  const [user, setUser] = useState<null | User>(null);
  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  return (
    <div>
      <H1>CYF Learning Lab</H1>
      <p>
        {user?.data ? (
          `Hi ${user.data.login}!`
        ) : (
          <ExternalLink href="/auth/login">
            Authenticate with GitHub
          </ExternalLink>
        )}
      </p>
    </div>
  );
};
