import {
  LuClipboardCheck,
  LuLayoutDashboard,
  LuLogOut,
  LuSquarePlus,
  LuUsers,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    id: "02",
    label: "Add Record",
    icon: LuSquarePlus,
    path: "/admin/add-record",
  },
  {
    id: "03",
    label: "All Employees",
    icon: LuUsers,
    path: "/admin/users",
  },
  {
    id: "05",
    label: "Logout",
    icon: LuLogOut,
    path: "logout",
  },
];

export const SIDE_MENU_USER_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/user/dashboard",
  },
  {
    id: "02",
    label: "Logout",
    icon: LuLogOut,
    path: "logout",
  },
];

export const PRIORITY_DATA = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

export const STATUS_DATA = [
    { label: "Pending", value: "Pending" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
]
