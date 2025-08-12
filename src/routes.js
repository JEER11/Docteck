// 2. The `type` key with the `title` value is used for a title inside the Sidenav.
// 3. The `type` key with the `divider` value is used for a divider between Sidenav items.
// 4. The `name` key is used for the name of the route on the Sidenav.
// 5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
// 6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
// 7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
//    inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
// 8. The `route` key is used to store the route location which is used for the react router.
// 9. The `href` key is used to store the external links location.
// 10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
// 11. The `component` key is used to store the component of its route.

// Vision UI Dashboard React layouts & components
import React from "react";
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import Profile from "layouts/profile";
import Assistance from "layouts/assistance";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Family from "layouts/profile/Family";
import Pets from "layouts/profile/Pets";

// Vision UI Dashboard React icons (keep grouped together)
import { IoRocketSharp } from "react-icons/io5";
import { IoIosDocument } from "react-icons/io";
import { BsFillPersonFill } from "react-icons/bs";
import { IoBuild } from "react-icons/io5"; // (unused?)
import { BsCreditCardFill } from "react-icons/bs";
import { IoHome } from "react-icons/io5";
import { FaDog, FaUsers, FaHandsHelping, FaUserNurse } from "react-icons/fa";

// Lazy-loaded layouts
const RTL = React.lazy(() => import("layouts/rtl"));

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <IoHome size="15px" color="inherit" />,
    component: Dashboard,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Caring Hub",
    key: "tables",
    route: "/tables",
    icon: <FaHandsHelping size="15px" color="inherit" />,
    component: Tables,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Assistance",
    key: "assistance",
    route: "/assistance",
    icon: <FaUserNurse size="15px" color="inherit" />,
  component: Assistance,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    route: "/billing",
    icon: <BsCreditCardFill size="15px" color="inherit" />, 
    component: Billing,
    noCollapse: true,
  },
  { type: "title", title: "Account Pages", key: "account-pages" },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <BsFillPersonFill size="15px" color="inherit" />,
    component: Profile,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Family",
    key: "family",
    route: "/profile/family",
    icon: <FaUsers size="15px" color="inherit" />,
    component: Family,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Pets",
    key: "pets",
    route: "/profile/pets",
    icon: <FaDog size="15px" color="inherit" />,
    component: Pets,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in",
    icon: <IoIosDocument size="15px" color="inherit" />,
    component: SignIn,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    route: "/authentication/sign-up",
    icon: <IoRocketSharp size="15px" color="inherit" />,
    component: SignUp,
    noCollapse: true,
  },
];

export default routes;
