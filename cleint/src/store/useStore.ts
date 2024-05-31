import { createAppSlice } from "./createAppSlice";
//@ts-ignore
import { devtools } from "zustand/middleware";
//@ts-ignore
import { create } from 'zustand';

const useStore = create(
  //@ts-ignore
  devtools((set, get) => ({
    ...createAppSlice(set, get),
    // ...createNotificationSlice(set, get),
  }))
);

export default useStore;
