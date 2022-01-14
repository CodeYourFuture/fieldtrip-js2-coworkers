import { useState, useEffect } from "react";

type User = {
  data: any;
};

export function App() {
  const [user, setUser] = useState<null | User>(null);
  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  return (
    <div>
      <h1>CYF Learning Lab</h1>
      <p>
        {user?.data ? (
          `Hi ${user.data.login}!`
        ) : (
          <a href="/auth/login">Authenticate with GitHub</a>
        )}
      </p>
    </div>
  );
}
