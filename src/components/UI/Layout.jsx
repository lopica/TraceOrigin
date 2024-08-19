import { Fragment } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../Header";
import SideBar from "./SideBar";
import { useSelector } from "react-redux";
import Toast from "./Toast";
import Breadcrumps from "../Breadcrumbs";

export default function Layout() {
  const location = useLocation();
  const currentPath = location.pathname;
  const matchPaterm =
    // currentPath.startsWith("/manufacturer") || currentPath.startsWith("/admin");
    currentPath.startsWith("/admin");
  const { show, content } = useSelector((state) => state.toast);

  return (
    <Fragment>
      <Toast show={show}>{content}</Toast>
      <header className="fixed top-0 left-0 right-0 w-full h-[8vh] z-10">
        <Header />
      </header>
      <section className="pt-[8vh] min-h-screen flex">
        {matchPaterm && (
          <aside className="fixed h-full hidden md:block md:w-[15vw]">
            <SideBar />
          </aside>
        )}
        <main className={`flex-1 ${matchPaterm ? "md:ml-[15vw]" : ""}`}>
          {/* <Breadcrumps /> */}
          <Outlet />
        </main>
        {!matchPaterm && !currentPath.startsWith("/portal") && (
          <df-messenger
            intent="WELCOME"
            chat-title="TraceOrigin"
            agent-id="67bc6c72-5b16-436a-9aaa-80a9a098625b"
            language-code="en"
            chat-icon="/logo_white.png"
            auto-open="false"
          >
            <style>
              {`
              df-messenger {
                margin: 0;
                padding: 0;
                position: fixed;
                right: 0;
                z-index: 10;
                --df-messenger-bot-message: #fff;
                --df-messenger-button-titlebar-color: #38bdf8;
                --df-messenger-chat-background-color: #fafafa;
                --df-messenger-send-icon: #38bdf8;
                --df-messenger-titlebar-icon-width: 24px;
                --df-messenger-titlebar-icon-height: 24px;
                --df-messenger-titlebar-icon-padding: 0 12px 0 0;
              }
            `}
            </style>
          </df-messenger>
        )}
      </section>
      <footer></footer>
    </Fragment>
  );
}
