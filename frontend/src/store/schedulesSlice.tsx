import { Project } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SchedulesState {
  project: Project | null;
  color: string;
  event_type: string[];
  opened: boolean;
  subgroups: [];
}

const initialState: SchedulesState = {
  project: null,
  color: "",
  event_type: [],
  opened: false,
  subgroups: [],
};

const schedulesSlice = createSlice({
  name: "schedules",
  initialState,
  reducers: {
    setFilters: <K extends keyof SchedulesState>(state: SchedulesState, action: PayloadAction<{ key: K; value: SchedulesState[K] }>) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    clearFilters: (state) => {
      state.project = null;
      state.color = "";
      state.event_type = [];
      state.subgroups = [];
    },
    toggleFilters: (state) => {
      state.opened = !state.opened;
    },
  },
});

export const { setFilters, clearFilters, toggleFilters } = schedulesSlice.actions;
export default schedulesSlice.reducer;
