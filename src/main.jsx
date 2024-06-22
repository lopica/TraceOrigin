import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import "./index.css";
import { store } from "./store";
import {
  ManuLayout,
  ManuProductList,
  ManuProductDetail,
  ManuProductAdd,
  PublicLayout,
  Home,
  Login,
  ForgotPassword,
  Register,
  UserList
} from './pages';
import Item from "./pages/public/Item";
import PortalLayout from "./pages/public/PortalLayout";
import RequireAuth from './services/RequireAuth'
import AdminLayout from "./pages/admin/AdminLayout";
import Manhtest from "./pages/admin/AdminLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    // errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'item', element: <Item /> },
    ],
  },
  {
    path: "/portal",
    element: <PortalLayout />,
    // errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'change-password', element: <ForgotPassword /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: "/manufacturer",
    element: <ManuLayout />,
    children: [
      { index: true, element: <p>Hello Manufacturer</p> },
      { path: 'products', element: <ManuProductList /> },
      { path: "products/:productId", element: <ManuProductDetail /> },
      { path: "products/add", element: <ManuProductAdd /> },
    ]
  },
  {
    path: "/admin",
    element: <RequireAuth><AdminLayout /></RequireAuth>,
    children: [
      { path: 'userList', element: <UserList /> },
    ]
    }
  ,
  {
    path: "/manh",
    children: [
      { path: 'test', element: <Manhtest /> },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
