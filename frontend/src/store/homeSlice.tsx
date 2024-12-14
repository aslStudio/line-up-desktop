import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HomeState {
  project: string[];
  color: string;
  event_type: string[];
  schedules: string[];
  opened: boolean;
  subgroups: string[];
}

const initialState: HomeState = {
  project: [],
  schedules: [],
  opened: false,
  color: "",
  event_type: [],
  subgroups: [],
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setFilters: <K extends keyof HomeState>(state: HomeState, action: PayloadAction<{ key: K; value: HomeState[K] }>) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    clearFilters: (state) => {
      state.project = [];
      state.schedules = [];
      state.color = "";
      state.event_type = [];
      state.subgroups = [];
    },
    toggleFilters: (state) => {
      state.opened = !state.opened;
    },
  },
});

export const { setFilters, clearFilters, toggleFilters } = homeSlice.actions;
export default homeSlice.reducer;
