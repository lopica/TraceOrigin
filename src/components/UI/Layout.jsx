import { Fragment, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../Header";
import SideBar from "./SideBar";
import { useSelector } from "react-redux";
import Toast from "./Toast";
import Breadcrumps from "../Breadcrumbs";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate()
  const currentPath = location.pathname;
  const { isAuthenticated } = useSelector((state) => state.authSlice);
  const matchPaterm = currentPath.startsWith("/manufacturer");
  const { show, content } = useSelector((state) => state.toast);

  useEffect(() => {
    if (currentPath.startsWith("/manufacturer") || currentPath.startsWith("/admin")) {
      console.log(isAuthenticated)
      if (!isAuthenticated) {
        console.log(isAuthenticated)
        navigate('/portal/login')
      }
    }
  }, [isAuthenticated]);

  return (
    <Fragment>
      <Toast show={show}>{content}</Toast>
      <header className="fixed top-0 left-0 right-0 w-full h-[8svh] z-10">
        <Header />
      </header>
      <section className="pt-[8svh] grid grid-cols-5">
        {matchPaterm && (
          <aside className="hidden md:block">
            <SideBar />
          </aside>
        )}
        {matchPaterm && (
          <main className="col-span-5 md:col-span-4">
            {/* <Breadcrumps /> */}
            <Outlet />
          </main>
        )}
        {!matchPaterm && (
          <main className="col-span-5">
            <Outlet />
          </main>
        )}
      </section>
      <footer></footer>
    </Fragment>
  );
}
