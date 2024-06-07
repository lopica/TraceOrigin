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
  Register
} from './pages';
import Item from "./pages/public/Item";
import ManuItems from "./pages/manufacturer/ManuItems";
import PortalLayout from "./pages/public/PortalLayout";
import RequireAuth from './services/RequireAuth'

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    // errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'item/:itemId', element: <Item /> },
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
      { path: "items", element: <ManuItems /> },
    ]
  },
  {
    path: "/admin",
    element: <ManuLayout />,
    children: [

    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
