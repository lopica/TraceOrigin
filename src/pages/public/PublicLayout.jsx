import { Outlet } from "react-router-dom";
import Header from "../../components/Header";

function PublicLayout() {

  return (
    <div className="h-svh">
      <header className="h-[10svh]"><Header /></header>
      <main className="h-[90svh] overflow-y-auto"><Outlet /></main>
    </div>
  );
}

export default PublicLayout;
