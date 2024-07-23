import { Link } from "react-router-dom";
import { CONSTANTS } from "../../services/Constants";

export default function ErrorPage() {
  return (
    <div className="flex flex-col justify-center items-center h-svh w-svw">
      <img src="/logo_full.png" alt="full logo" className="h-20 w-auto" />
      <h1 className="text-5xl p-4 pt-0">404</h1>
      <div className="pt-4 flex flex-col justify-center items-center">
        <p>Mình không có đường dẫn này nhé.</p>
        <Link
          to={`https://trace-origin.netlify.app`}
          className="text-blue-500 hover:text-sky-700"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
