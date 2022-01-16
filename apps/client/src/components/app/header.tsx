import type { FC } from "react";
import useFetch from "use-http";
import { Container, Flash } from "src/components/library";
import logo from "src/assets/logo.png";

type User = {
  loing: string;
  avatar_url: string;
};

export const Header: FC = () => {
  const { error, loading, data } = useFetch<User>("/api/user", []);
  return (
    <header className="border-b border-gray-200 bg-slate-50">
      {error && <Flash>{error.message}</Flash>}
      <Container className="flex justify-between py-4">
        <div className="flex items-center">
          <img src={logo} className="block pr-2 w-28" alt="CYF logo" />
          <div className="text-xs font-medium uppercase text-slate-500">
            Learning Lab
          </div>
        </div>
        <div className="flex items-center">
          {data && (
            <img
              src={data.avatar_url}
              alt="User Github avatar"
              className="w-8 rounded-full"
            />
          )}
          {!data && !loading && (
            <a href="/auth/login" className="text-sm">
              Sign In
            </a>
          )}
        </div>
      </Container>
    </header>
  );
};
