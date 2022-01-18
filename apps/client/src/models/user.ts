import type { Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree";
import { types } from "mobx-state-tree";

export const User = types.model({
  login: types.string,
  avatar_url: types.string,
});

export interface IUser extends Instance<typeof User> {}
export interface IUserSnapshotIn extends SnapshotIn<typeof User> {}
export interface IUserSnapshotOut extends SnapshotOut<typeof User> {}
