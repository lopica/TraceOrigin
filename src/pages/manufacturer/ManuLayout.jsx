import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import Breadcrumbs from "../../components/Breadcrumbs";

function ManuLayout() {
  const mainContent = (
    <>
      <section>
        <Breadcrumbs />
      </section>
      <main>
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>
    </>
  );

  const sidebar = (
    <aside>
      <label
        htmlFor="my-drawer-2"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <ul className="menu p-4 w-52 min-h-full bg-base-100 text-base-content">
        {/* Sidebar content here */}
        <li>
          <a>Sidebar Item 1</a>
        </li>
        <li>
          <a>Sidebar Item 2</a>
        </li>
      </ul>
    </aside>
  );

  const header = (
    <header>
      <Header />
    </header>
  );

  return (
    <>
      <div className="max-h-[10svh]">{header}</div>
      <div className="drawer md:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col overflow-auto">
          {mainContent}
        </div>
        <div className="drawer-side max-h-[90svh]">{sidebar}</div>
      </div>
    </>
  );
}

export default ManuLayout;
