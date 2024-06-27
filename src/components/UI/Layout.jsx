import { Fragment } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../Header";
import SideBar from "./SideBar";
import { useSelector } from "react-redux";
import Toast from "./Toast";

export default function Layout() {
  const location = useLocation();
  const currentPath = location.pathname;
  const matchPaterm = currentPath.startsWith("/manufacturer");
  //   console.log(matchPaterm);
  const { show, content } = useSelector((state) => state.toast);
  return (
    <Fragment>
      <Toast show={show}>{content}</Toast>
      <header className="fixed top-0 left-0 right-0 w-full h-[8svh] z-10">
        <Header />
      </header>
      <section className="pt-[8svh]">
        <aside>{matchPaterm && <SideBar />}</aside>
        <main>
          <Outlet />
        </main>
      </section>
      <footer></footer>
    </Fragment>
  );
}
