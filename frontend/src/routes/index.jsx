import React, { useContext } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Home from "@/Pages/Home.jsx";
import About from "@/Pages/About.jsx";
import Contact from "@/Pages/Contact.jsx";
import RecipeForm from "@/Pages/RecipeForm.jsx";
import Orders from "@/Pages/Orders.jsx";
import Menus from "@/Pages/Menus.jsx";
import OrderSettings from "@/Pages/OrderSettings.jsx";
import AddItems from "@/Pages/AddItems.jsx";
import SignUpForm from "@/Pages/SignUpForm.jsx";
import SignInForm from "@/Pages/SignInForm.jsx";
import App from "@/App.jsx";
import { AuthContext } from "@/contexts/authContext.jsx";
import Option from "@/Pages/Option";
import NewOption from "@/Pages/NewOption";
import MenuSettings from "@/Pages/MenuSettings";

function index() {
  const { user } = useContext(AuthContext);
  console.log(user);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "",
          element: user ? <Home /> : <Navigate to={"/sign-in"} />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },
        {
          path: "/recipes/create",
          element: user ? <RecipeForm /> : <Navigate to={"/sign-in"} />,
        },
        {
          path: "/orders",
          element: user ? <Orders /> : <Navigate to={"/sign-in"} />,
        },
        {
          path: "/menus",
          element: user ? <MenuSettings /> : <Navigate to={"/sign-in"} />,
        },
        {
          path: "/menus/menuOverview",
          element:  <Menus /> ,
        },
        {
          path: "/orderSettings",
          element: user ? <OrderSettings /> : <Navigate to={"/sign-in"} />,
        },
        {
          path: "/menus/menuOverview/addItems",
          element: user ? <AddItems /> : <Navigate to={"/sign-in"} />,
        },
        {
          path: "/menus/menuOverview/editItems/:id",
          element: user ? <AddItems /> : <Navigate to={"/sign-in"} />,
        },
        {
          path: "/menus/optionGroups",
          element: user ? <Option /> : <Navigate to={"/sign-in"} />,
        },
        {
          path: "/menus/optionGroups/addOptions",
          element: <NewOption />,
        },
        {
          path: "/menus/optionGroups/editOptions/:id",
          element: <NewOption />,
        },
        {
          path: "/sign-up",
          element: !user ? <SignUpForm /> : <Navigate to={"/"} />,
        },
        {
          path: "/sign-in",
          element: !user ? <SignInForm /> : <Navigate to={"/"} />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default index;
