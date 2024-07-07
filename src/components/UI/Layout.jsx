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
  const matchPaterm = currentPath.startsWith("/manufacturer") || currentPath.startsWith("/admin");
  const { show, content } = useSelector((state) => state.toast);

  useEffect(() => {
    if (currentPath.startsWith("/manufacturer") || currentPath.startsWith("/admin")) {
      if (!isAuthenticated) {
        navigate('/portal/login')
      }
    }
  }, [isAuthenticated, currentPath]);

  return (
    <Fragment>
      <Toast show={show}>{content}</Toast>
      <header className="fixed top-0 left-0 right-0 w-full h-[8svh] z-10">
        <Header />
      </header>
      <section className="pt-[8svh]">
        {matchPaterm && (
          <aside className="hidden md:block md:h-[92svh] md:fixed md:w-[15svw] bg-sky-800 text-white">
            <SideBar />
          </aside>
        )}
        {matchPaterm && (
          <main className="md:ml-[15svw]">
            <Outlet />
          </main>
        )}
        {!matchPaterm && (
          <main className="">
            <Outlet />
          </main>
        )}
      </section>
      <footer></footer>
    </Fragment>
  );
}
