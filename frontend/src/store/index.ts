import { configureStore } from "@reduxjs/toolkit";
import projectsApi from "@/api/projects";
import eventsApi from "@/api/events";
import searchReducer from "./searchSlice";
import authReducer from "./authSlice";
import projectsReducer from "./projectsSlice";
import authApi from "@/api/auth";
import notificationsApi from "@/api/notifications";
import schedulesReducer from "@/store/schedulesSlice";
import homeReducer from "@/store/homeSlice";
import profileApi from "@/api/profile";
import colorsApi from "@/api/color";
import personalLinkApi, { linkApi } from "@/api/link";
import subgroupsApi from "@/api/subgroups";
import notificationReducer from "./notifications";

const store = configureStore({
  reducer: {
    [projectsApi.reducerPath]: projectsApi.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [colorsApi.reducerPath]: colorsApi.reducer,
    [linkApi.reducerPath]: linkApi.reducer,
    [subgroupsApi.reducerPath]: subgroupsApi.reducer,
    notifications: notificationReducer,
    schedules: schedulesReducer,
    projects: projectsReducer,
    home: homeReducer,
    search: searchReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      projectsApi.middleware,
      eventsApi.middleware,
      authApi.middleware,
      notificationsApi.middleware,
      profileApi.middleware,
      colorsApi.middleware,
      linkApi.middleware,
      subgroupsApi.middleware,
    ),
});

export default store;
