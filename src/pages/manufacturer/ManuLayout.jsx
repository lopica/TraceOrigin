import { Link, Outlet } from "react-router-dom";
import Header from "../../components/Header";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useFetchUserQuery } from "../../store";
import { CONSTANTS } from "../../services/Constants";

function ManuLayout() {
  const { error, isFetching } = useFetchUserQuery();
  let mainContent;
  let sidebar;
  const header = (
    <header className="mb-4">
      <Header />
    </header>
  );
  if (isFetching) {
    mainContent = <div className="flex flex-col gap-4 mx-8 mt-8">
      <div className="skeleton h-10 w-full"></div>
      <div className="skeleton h-10 w-full"></div>
      <div className="skeleton h-10 w-full"></div>
    </div>
    sidebar = <></>
  } else if (error) {
    mainContent = <div><Outlet /></div>
    sidebar = <></>
  } else {
    mainContent = (
      <>
        <section>
          <Breadcrumbs />
        </section>
        <main>
          <div className="container mx-auto overflow-y-auto h-[85vh]">
            <Outlet />
          </div>
        </main>
      </>
    );

    sidebar = (
      <aside>
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-52 min-h-full bg-base-100 text-base-content">
          {/* Sidebar content here */}
          {CONSTANTS.menu.map(item => {
            return <li key={item.name}>
              <Link to={item.url}>{item.name}</Link>
            </li>
          })}
        </ul>
      </aside>
    );
  }



  return (
    <>
      <div className="max-h-[8svh]">{header}</div>
      <div className="drawer md:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col overflow-auto">
          {mainContent}
        </div>
        <div className="drawer-side max-h-[92svh]">{sidebar}</div>
      </div>
    </>
  );
}

export default ManuLayout;
