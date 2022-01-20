import * as mst from "mobx-state-tree";
import type { IRoot } from "src/models";

export const getRoot = (...args: Parameters<typeof mst.getRoot>): IRoot =>
  mst.getRoot<IRoot>(...args);
