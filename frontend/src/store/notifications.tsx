import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationsState {
  project: string[];
  schedules: string[];
  opened: boolean;
  subgroups: string[];
}

const initialState: NotificationsState = {
  project: [],
  schedules: [],
  opened: false,
  subgroups: [],
};

const NotificationsSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setFilters: <K extends keyof NotificationsState>(
      state: NotificationsState,
      action: PayloadAction<{ key: K; value: NotificationsState[K] }>,
    ) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    clearFilters: (state) => {
      state.project = [];
      state.schedules = [];
      state.subgroups = [];
    },
    toggleFilters: (state) => {
      state.opened = !state.opened;
    },
  },
});

export const { setFilters, clearFilters, toggleFilters } =
  NotificationsSlice.actions;
export default NotificationsSlice.reducer;
