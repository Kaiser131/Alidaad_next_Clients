import {
    createBrowserRouter,
} from "react-router-dom";
import Main from "../Layout/Main/Main";
import Home from "../Pages/Main/Home/Home";
import Login from "../Pages/Authenticate/Login";
import Register from "../Pages/Authenticate/Register";
import Dashboard from "../Layout/Dashboard/Dashboard";
import NewOrders from "../Pages/Dashboard/Orders/NewOrders";
import PendingOrders from "../Pages/Dashboard/Orders/PendingOrders";
import CompletedOrders from "../Pages/Dashboard/Orders/CompletedOrders";
import CancelledOrders from "../Pages/Dashboard/Orders/CancelledOrders";
import AllProducts from "../Pages/Dashboard/Product/AllProducts";
import AddProduct from "../Pages/Dashboard/Product/AddProduct";
import UpdateProducts from "../Pages/Dashboard/Product/UpdateProducts";
import Category from "../Pages/Main/Category/Category";
import Search from "../Pages/Main/Search/Search";
import Exp from "../Pages/Main/Exp/Exp";
import Checkout from "../Pages/Main/Checkout/Checkout";
import Products from "../Pages/Main/Products/Products";
import OrderConfirm from "../Pages/Main/OrderConfirm/OrderConfirm";
import OrderDetails from "../Pages/Dashboard/Orders/OrderDetails";
import ScrollTop from "../Utils/ScrollTop";
import Account from "../Pages/Main/Account/Account";
import ProductDetails from "../components/Shared/Product/ProductDetails";
import AdminChatList from "../Pages/Dashboard/Chat/AdminChatList";
import Users from "../Pages/Dashboard/Users/Users";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import ImagesEdit from "@/Pages/Dashboard/Edit/ImagesEdit";


const router = createBrowserRouter([
    {
        path: "/",
        element: <ScrollTop>
            <Main />
        </ScrollTop>,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/product_details/:id",
                element: <ProductDetails />,
            },
            {
                path: "/products",
                element: <Products />,
            },
            {
                path: "/category",
                element: <Category />,
            },
            {
                path: "/search",
                element: <Search />,
            },
            {
                path: "/checkout",
                element: <Checkout />,
            },
            {
                path: "/checkout/:id",
                element: <Checkout />,
            },
            {
                path: "/order_confirm/:order_id",
                element: <OrderConfirm />,
            },
            {
                path: "/account",
                element:
                    <PrivateRoute>
                        <Account />
                    </PrivateRoute>
                ,
            },
            {
                path: "/exp",
                element: <Exp />,
            },
        ]
    },
    {
        path: 'login',
        element: <Login />
    },
    {
        path: 'register',
        element: <Register />
    },
    {
        path: 'dashboard',
        element: <ScrollTop>
            <AdminRoute>
                <Dashboard />
            </AdminRoute>
        </ScrollTop>,
        children: [
            { path: 'new_orders', element: <NewOrders /> },
            { path: 'order_details/:order_id', element: <OrderDetails /> },
            { path: 'pending_orders', element: <PendingOrders /> },
            { path: 'completed_orders', element: <CompletedOrders /> },
            { path: 'cancelled_orders', element: <CancelledOrders /> },
            { path: 'all_product', element: <AllProducts /> },
            { path: 'add_product', element: <AddProduct /> },
            { path: 'admin_chat', element: <AdminChatList /> },
            { path: 'update_product/:id', element: <UpdateProducts /> },
            { path: 'users', element: <Users /> },
            { path: 'imagesEdit', element: <ImagesEdit /> }
        ]
    },
]);

export default router;