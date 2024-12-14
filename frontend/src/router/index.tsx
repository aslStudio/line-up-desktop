import Home from "../pages/home";
import Event from "../pages/event";
import { IRoute } from "../types/route";

import { ReactComponent as CalendarIcon } from "@/assets/icons/navbar/calendar.svg";
import { ReactComponent as GroupIcon } from "@/assets/icons/navbar/group.svg";
import { ReactComponent as NotifyIcon } from "@/assets/icons/navbar/notify.svg";
import { ReactComponent as ProfileIcon } from "@/assets/icons/navbar/profile.svg";
import { ReactComponent as StarIcon } from "@/assets/icons/navbar/star.svg";

import CrossEvents from "@/pages/cross-events";
import NewEvent from "@/pages/new-event";
import NewProject from "@/pages/new-project";
import Project from "@/pages/project";
import Projects from "@/pages/projects";
import Notifications from "@/pages/notifications";
import Schedules from "@/pages/schedules";
import Profile from "@/pages/profile";
import Edit from "@/pages/profile/components/Edit/Edit";
import Security from "@/pages/profile/components/Security/Security";
import Contacts from "@/pages/profile/components/Contacts/Contacts";
import User from "@/pages/user";
import BlockedUsers from "@/pages/profile/components/BlockedUsers/BlockedUsers";
import Support from "@/pages/support";
import Faq from "@/pages/support/components/Faq/Faq";
import Agreement from "@/pages/support/components/Agreement/Agreement";
import Education from "@/pages/education";
import PasswordReset from "@/pages/auth/components/PasswordReset";
import Login from "@/pages/auth/components/Auth/Login/Login";
import Registration from "@/pages/auth/components/Register";
import EditProject from "@/pages/edit-project";
import Schedule from "@/pages/schedule";

export const routes: IRoute[] = [
  {
    path: "/",
    component: Home,
    icon: CalendarIcon,
    title: "Календарь",
    isPrivate: true,
  },
  {
    path: "/schedules",
    component: Schedules,
    icon: StarIcon,
    title: "Расписание",
    isPrivate: true,
  },
  {
    path: "/cross-events",
    component: CrossEvents,
    isPrivate: true,
  },
  {
    path: "/schedule/:id",
    component: Schedule,
    isPrivate: true,
  },
  {
    path: "/projects",
    component: Projects,
    icon: GroupIcon,
    title: "Проекты",
    isPrivate: true,
  },
  {
    path: "/notifications",
    component: Notifications,
    icon: NotifyIcon,
    title: "Уведомления",
    isPrivate: true,
  },

  {
    isPrivate: false,
    path: "/login",
    component: Login,
  },
  {
    path: "/registration",
    component: Registration,
    isPrivate: false,
  },
  {
    path: "/password-reset",
    component: PasswordReset,
    isPrivate: false,
  },
  {
    path: "/event",
    component: Event,
    isPrivate: false,
  },
  {
    path: "/new-event",
    component: NewEvent,
    isPrivate: false,
  },
  {
    path: "/project/:id",
    component: Project,
    isPrivate: true,
  },
  {
    path: "/project-edit/:id",
    component: EditProject,
    isPrivate: true,
  },
  {
    path: "/new-project",
    component: NewProject,
    isPrivate: true,
  },
  {
    path: "/profile",
    icon: ProfileIcon,
    component: Profile,
    title: "Профиль",
    isPrivate: true,
  },
  {
    path: "/profile/edit",
    component: Edit,
    isPrivate: true,
  },
  {
    path: "/contacts",
    component: Contacts,
    isPrivate: true,
  },
  {
    path: "/blocked-users",
    component: BlockedUsers,
    isPrivate: true,
  },
  {
    path: "/security",
    component: Security,
    isPrivate: true,
  },
  {
    path: "/user/:id",
    component: User,
    isPrivate: true,
  },
  {
    path: "/support",
    component: Support,
    isPrivate: true,
  },
  {
    path: "/faq",
    component: Faq,
    isPrivate: true,
  },
  {
    path: "/agreement",
    component: Agreement,
    isPrivate: true,
  },
  {
    path: "/education",
    component: Education,
    isPrivate: true,
  },
];
