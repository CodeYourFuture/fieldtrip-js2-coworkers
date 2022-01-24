import type { FC } from "react";
import { observer } from "mobx-react-lite";
import { Container } from "src/components/library";
import { LOGIN_URL } from "src/config";
import { useMst } from "src/store";
import logo from "src/assets/logo.png";

export const Header: FC = observer(() => {
  const { user } = useMst();
  return (
    <header className="border-b border-gray-200 bg-slate-50">
      <Container className="flex justify-between py-4">
        <div className="flex items-center">
          <img src={logo} className="block pr-2 w-28" alt="CYF logo" />
          <div className="text-xs font-medium uppercase text-slate-500">
            Learning Lab
          </div>
        </div>
        <div className="flex items-center">
          {user && (
            <img
              src={user.avatar_url}
              alt="User Github avatar"
              className="w-8 rounded-full"
            />
          )}
          {!user && (
            <a href={LOGIN_URL} className="text-sm">
              Sign In
            </a>
          )}
        </div>
      </Container>
    </header>
  );
});
