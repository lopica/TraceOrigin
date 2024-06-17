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
    element: <RequireAuth><PortalLayout /></RequireAuth>,
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
    element: <RequireAuth><ManuLayout /></RequireAuth>,
    children: [
      { index: true, element: <p>Hello Manufacturer</p> },
      { path: 'products', element: <ManuProductList /> },
      { path: "products/:productId", element: <ManuProductDetail /> },
      { path: "products/add", element: <ManuProductAdd /> },
    ]
  },
  {
    path: "/admin",
    element: <ManuLayout />,
    children: [
    ]
  }
  ,
  {
    path: "/manh",
    element: <PortalLayout />,
    children: [
      { path: 'test', element: <UserList /> },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
