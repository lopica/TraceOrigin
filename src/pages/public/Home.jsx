import { Link, useLocation } from "react-router-dom";

function Home() {
  let location = useLocation();
  let content;
  if (location.pathname.startsWith("/portal"))
    content = <div className="flex justify-center gap-4">
      <Link to='login'>
        <button className="btn btn-warning">Manufacturer</button>
      </Link>
      <Link to='login'>
        <button className="btn btn-error">Admin</button>
      </Link>
    </div>
  else content = <Link to='/manufacturer/products/test'>Test</Link>
  return <>{content}</>
}

export default Home;
