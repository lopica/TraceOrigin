import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ManuLayout from "./pages/manufacturer/ManuLayout";
import "./index.css";
import ManuProductList from "./pages/manufacturer/ManuProductList";
import ManuProductDetail from "./pages/manufacturer/ManuProductDetail";
import ManuProductAdd from "./pages/manufacturer/ManuProductAdd";
import { Provider } from "react-redux";
import { store } from "./store";

const router = createBrowserRouter([
  {
    path: "/manufacturer",
    element: <ManuLayout />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <ManuProductList />,
      },
      {
        path: ":productId",
        element: <ManuProductDetail />,
      },
      {
        path: "add",
        element: <ManuProductAdd />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
