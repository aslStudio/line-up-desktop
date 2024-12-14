import { Project } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProjectState {
  project: Project | null;
  color: string;
  event_type: string[];
  opened: boolean;
  subgroups: [];
}

const initialState: ProjectState = {
  project: null,
  color: "",
  event_type: [],
  opened: false,
  subgroups: [],
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setFilters: <K extends keyof ProjectState>(state: ProjectState, action: PayloadAction<{ key: K; value: ProjectState[K] }>) => {
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

export const { setFilters, clearFilters, toggleFilters } = projectsSlice.actions;
export default projectsSlice.reducer;
