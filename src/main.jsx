import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import "./index.css";
import { store } from "./store";
import {
  ManuProductList,
  ManuProductDetail,
  ManuProductAdd,
  Home,
  Login,
  ForgotPassword,
  Register
} from './pages';
import Item from "./pages/public/Item";
import RequireAuth from './services/RequireAuth'
import Layout from "./components/UI/Layout";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'item',
        element: <Item />,
      },
      {
        path: "/portal",
        children: [
          { index: true, element: <Home /> },
          { path: 'login', element: <Login /> },
          { path: 'change-password', element: <ForgotPassword /> },
          { path: 'register', element: <Register /> },
        ],
      },
      {
        path: "/manufacturer",
        children: [
          { index: true, element: <p>Hello Manufacturer</p> },
          { path: 'products', element: <ManuProductList /> },
          { path: "products/:productId", element: <ManuProductDetail /> },
          { path: "products/add", element: <ManuProductAdd /> },
        ]
      },
      {
        path: "/admin",
        // element: <AdminLayout />,
        children: [
          // Define children for the admin route here if needed
        ]
      }
    ]
  }
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
