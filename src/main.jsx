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
      {path: 'item/:itemId', element: <Item />},
    ],
  },
  {
    path: "/manufacturer",
    element: <ManuLayout />,
    // errorElement: <ErrorPage />,
    children: [
      { index: true, element: <ManuProductList /> },
      { path: ":productId", element: <ManuProductDetail /> },
      { path: "add", element: <ManuProductAdd /> },
      { path: "items", element: <ManuItems /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
);
