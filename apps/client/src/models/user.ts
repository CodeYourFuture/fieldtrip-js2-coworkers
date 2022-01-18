import { types } from "mobx-state-tree";

export const User = types.model({
  login: types.string,
  avatar_url: types.string,
});
