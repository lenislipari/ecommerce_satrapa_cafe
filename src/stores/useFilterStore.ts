"use client";

import { create } from "zustand";
import type { CATEGORIES } from "@/types/product";

export type Filter = "todos" | (typeof CATEGORIES)[number];

type FilterState = {
  filter: Filter;
  setFilter: (filter: Filter) => void;
};

export const useFilterStore = create<FilterState>()((set) => ({
  filter: "todos",
  setFilter: (filter) => set({ filter }),
}));
