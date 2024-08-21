import { Fragment, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../Header";
import SideBar from "./SideBar";
import { useDispatch, useSelector } from "react-redux";
import Toast from "./Toast";
import Breadcrumps from "../Breadcrumbs";
import Joyride from "react-joyride";
import {
  setRun,
  setStepIndex,
  setStepIndexNext,
  setSteps,
  setTourActive,
} from "../../store";

export default function Layout() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const matchPaterm =
    currentPath.startsWith("/manufacturer") || currentPath.startsWith("/admin");
  // currentPath.startsWith("/admin");
  const { show, content } = useSelector((state) => state.toast);
  const user = useSelector((state) => state.userSlice);
  const { run, steps, stepIndex, tourActive } = useSelector(
    (state) => state.joyrideSlice
  );
  const { isAuthenticated } = useSelector((state) => state.authSlice);

  const handleJoyrideCallback = (data) => {
    const {
      action,
      index,
      step: { nav },
      type,
    } = data;
    if (type === "step:after") {
      if (nav?.next) {
        dispatch(setRun(false));
        navigate(nav?.next);
      } else {
        dispatch(setStepIndexNext());
      }
    }
  };

  useEffect(() => {
    if (tourActive) {
      dispatch(
        setSteps([
          {
            target: "body",
            content:
              "Chào bạn, để có thể sử dụng dịch vụ của chúng tôi, đầu tiên bạn sẽ cần xác thực về tổ chức của bạn",
            placement: "center",
            nav: {},
          },
          {
            target: "#menu-2",
            content: "Đầu tiên, bạn cần xác thực về tổ chức của bạn tại đây",
            nav: {
              next: "/manufacturer/certificate",
            },
          },
          {
            target: "#add-ceritficate",
            content:
              "Tại đây bạn sẽ tải lên hình ảnh giấy tờ từ cơ quan bạn để chứng minh sự hợp pháp của tổ chức của bạn",
            nav: {
              previous: "/manufacturer/products",
            },
          },
          {
            target: "#verify-certificate",
            content:
              "Sau khi điền thông tin chứng chỉ, bạn hãy bấm vào xác minh để admin phê duyệt, thời gian duyệt từ 1-2 ngày giờ hành chính",
          },
        ])
      );
    } else {
      dispatch(setSteps([]));
    }
  }, [tourActive]);

  useEffect(() => {
    console.log("vo");
    if (
      user?.role &&
      user.role?.roleId == 2 &&
      currentPath === "/manufacturer/products" &&
      user?.status == 7 &&
      isAuthenticated
    ) {
      console.log("vo day nhe");
      dispatch(setTourActive(true));
      dispatch(setRun(true));
    }
  }, [user, currentPath]);

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("vo day nua");
      dispatch(setRun(false));
      dispatch(setStepIndex(0));
      dispatch(setSteps([]));
      dispatch(setTourActive(false));
    }
  }, [isAuthenticated, currentPath]);

  return (
    <Fragment>
      <Joyride
        steps={steps}
        run={run}
        continuous={true}
        scrollToFirstStep={true}
        showProgress={true}
        callback={handleJoyrideCallback}
        stepIndex={stepIndex}
        hideCloseButton
        hideBackButton
        debug
      />
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
        {!currentPath.startsWith("/admin") &&
          !currentPath.startsWith("/portal") && (
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
