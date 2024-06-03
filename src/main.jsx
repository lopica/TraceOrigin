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

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    // errorElement: <ErrorPage />,
    children: [
      {index: true, element: <Home />},
      {path: 'login', element: <Login />},
      {path: 'change-password', element: <ForgotPassword />},
      {path: 'register', element: <Register />},
    ],
  },
  {
    path: "/manufacturer",
    element: <ManuLayout />,
    // errorElement: <ErrorPage />,
    children: [
      { path: "", element: <ManuProductList /> },
      { path: ":productId", element: <ManuProductDetail /> },
      { path: "add", element: <ManuProductAdd /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
);
