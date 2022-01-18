import { useContext, createContext } from "react";
import { store } from "src/store";

const RootStoreContext = createContext(null as any as typeof store);

export const Provider = RootStoreContext.Provider;

export function useMst() {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }
  return store;
}
