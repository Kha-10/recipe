import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Home from '../src/Pages/Home.jsx';
import About from '../src/Pages/About.jsx';
import Contact from '../src/Pages/Contact.jsx';
import RecipeForm from '../src/Pages/RecipeForm.jsx';
import Orders from './Pages/Orders.jsx';
import Menus from './Pages/Menus.jsx';
import OrderSettings from './Pages/OrderSettings.jsx';
import AddItems from './Pages/AddItems.jsx';
import SignUpForm from './Pages/SignUpForm.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children : [
      {
        path : '',
        element : <Home/>
      },
      {
        path : '/about',
        element : <About/>
      },
      {
        path : '/contact',
        element : <Contact/>
      },
      {
        path : '/recipes/create',
        element : <RecipeForm/>
      },
      {
        path : '/orders',
        element : <Orders/>
      },
      {
        path : '/menus',
        element : <Menus/>
      },
      {
        path : '/orderSettings',
        element : <OrderSettings/>
      },
      {
        path : '/menus/addItems',
        element : <AddItems/>
      },
      {
        path : '/menus/editItems/:id',
        element : <AddItems/>
      },
      {
        path : '/sign-up',
        element : <SignUpForm/>
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
