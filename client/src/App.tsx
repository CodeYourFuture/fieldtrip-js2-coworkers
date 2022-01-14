import type { FC } from "react";
import useFetch from "use-http";
import { RouteComponentProps } from "@reach/router";
import { H1, ExternalLink } from "@djgrant/components";

type User = {
  data: any;
};

export const App: FC<RouteComponentProps> = () => {
  const { loading, error, data } = useFetch<User>("/api/user");
  if (error) return <div>Error! {JSON.stringify(error)}</div>;
  if (loading) return <p>Loading...</p>;
  return (
    <div>
      <H1>CYF Learning Lab</H1>
      <p>
        {data ? (
          `Hi ${data.data.login}!`
        ) : (
          <ExternalLink href="/auth/login">
            Authenticate with GitHub
          </ExternalLink>
        )}
      </p>
    </div>
  );
};
