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
ManufacturerList,
VerifyManufacturer,
  ManuItemDetail,
} from "./pages";
import ManuCertificateList from "./pages/manufacturer/ManuCertificateList";
import ManuCertificateAdd from "./pages/manufacturer/ManuCertificateAdd";
import ManuCertificateDetail from "./pages/manufacturer/ManuCertificateDetail";
import Item from "./pages/public/Item";
import Layout from "./components/UI/Layout";
import Splash from "./pages/public/Splash";
import AdminMonitoring from "./pages/admin/AdminMonitoring";
import ManuReportManager from "./pages/manufacturer/ManuReportManager";
import ErrorPage from "./pages/public/ErrorPage";
import CreateReport from "./pages/public/CreateReport";
import CustomerService from "./pages/admin/CustomerService";
import ManuSupportSystem from "./pages/manufacturer/ManuSupportSystem";
import SupportSystem from "./pages/admin/SupportSystem";
import CategoryTable from "./pages/admin/CategoryTable";
import UpdateFileAI from "./pages/admin/UpdateFileAI";
import ManagerRequestTranningImage from "./pages/admin/ManagerRequestTranningImage";

const persistor = persistStore(store);

function AppRouter() {
  const user = useSelector((state) => state.userSlice);
  // console.log(user)
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
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
            { path: "newReport", element: <CreateReport /> },
          ],
        },
        {
          path: "/manufacturer",
          children: [
            { index: true, element: <p>Hello Manufacturer</p> },
            { path: "certificate", element: <ManuCertificateList /> },
            { path: "certificate/add", element: <ManuCertificateAdd /> },
            { path: "certificate/:certId", element: <ManuCertificateDetail /> },
            { path: "products", element: <ManuProductList /> },
            { path: "products/:productId", element: <ManuProductDetail /> },
            { path: "products/add", element: <ManuProductAdd /> },
            { path: "products/:productId/:itemId", element: <ManuItemDetail /> },
            { path: "reportManager", element: <ManuReportManager /> },
            { path: "reportManager/:id", element: <ManuReportManager />},
            { path: "createReport", element: <ManuReportManager />},
            { path: "support", element: <ManuSupportSystem /> },
            
          ],
        },
        {
          path: "/admin",
          children: [
            { path: 'manufacturerList', element: <ManufacturerList /> },
            { path: 'customerService', element: <CustomerService /> },
            { path: 'verifyManufacturers', element: <VerifyManufacturer /> },
            { path: 'adminMonitoring', element: <AdminMonitoring /> },
            { path: 'supportSystem', element: <SupportSystem /> },
            { path: 'categoryManager', element: <CategoryTable /> },
            { path: 'uploadFileAI', element: <UpdateFileAI /> },
            { path: 'managerRequestTranningImage', element: <ManagerRequestTranningImage /> },
          ]
          }
        ,
        {
          path: "/manh",
          children: [
            { path: 'test', element: <manhTest /> },
          ]
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
