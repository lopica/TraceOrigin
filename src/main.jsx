import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import "./index.css";
import { store } from "./store";
import {
  ManuProductList,
  ManuProductDetail,
  ManuProductAdd,
  Home,
  Login,
  ForgotPassword,
  Register,
  ManuItemDetail,
} from "./pages";
import Item from "./pages/public/Item";
import Layout from "./components/UI/Layout";
import Splash from "./pages/public/Splash";

const persistor = persistStore(store);

function AppRouter() {
  const user = useSelector((state) => state.userSlice);
  // console.log(user)
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "item",
          element: <Item />,
        },
        {
          path: "/portal",
          children: [
            { index: true, element: <Home /> },
            { path: "login", element: <Login /> },
            { path: "change-password", element: <ForgotPassword /> },
            { path: "register", element: <Register /> },
          ],
        },
        {
          path: "/manufacturer",
          children: [
            { index: true, element: <p>Hello Manufacturer</p> },
            { path: "products", element: <ManuProductList /> },
            { path: "products/:productId", element: <ManuProductDetail /> },
            { path: "products/add", element: <ManuProductAdd /> },
            { path: "products/:productId/:itemId", element: <ManuItemDetail /> },
          ],
        },
        {
          path: "/admin",
          children: [
            // Define children for the admin route here if needed
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={<Splash />} persistor={persistor}>
      <AppRouter />
    </PersistGate>
  </Provider>
);
