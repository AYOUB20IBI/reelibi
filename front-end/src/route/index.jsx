import { createBrowserRouter } from "react-router-dom";
import Login from './../pages/Login';
import Signup from "../pages/Signup";
import Home from "../pages/home/Home";
import Layout from './../Layout';
import Search from "../pages/search/Search";
import Profile from "../pages/profile/Profile";
import UserSettings from './../pages/profile/UserSettings';
import UsersProfile from './../pages/users/UsersProfile';
import ForgotPassword from "../pages/ForgotPassword";
export const routes = createBrowserRouter([
    {
        path: "/login",
        element:<Login/>
    },
    {
        path: "/signup",
        element:<Signup/>
    },
    {
        path: "*",
        element:<ForgotPassword/>
    },
    {
        path: "/forgot/password",
        element:<ForgotPassword/>
    },
    {
        element:<Layout/>,
        children:[
            {
                path:"/",
                element:<Home/>
            },
            {
                path:"/profile",
                element:<Profile/>
            },
            {
                path:"/setting",
                element:<UserSettings/>
            },
            {
                path:"/search",
                element:<Search/>
            },
            {
                path:"/profile/:id/user",
                element:<UsersProfile/>
            }
        ]
    }

])