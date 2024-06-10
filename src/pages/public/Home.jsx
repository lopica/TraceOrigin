import { Link, useLocation } from "react-router-dom";

function Home() {
  let location = useLocation();
  let content;
  if (location.pathname.startsWith("/portal"))
    content = (
      <div className="flex justify-center gap-4">
        <Link to="login">
          <button className="btn btn-warning">Manufacturer</button>
        </Link>
        <Link to="login">
          <button className="btn btn-error">Admin</button>
        </Link>
      </div>
    );
  else
    content = (
      <>
        <div
          className="hero h-[50svh]"
          style={{
            backgroundImage:
              "url(/hero.jpg)",
          }}
        >
          <div className="hero-overlay bg-opacity-80"></div>
          <div className="hero-content text-center text-neutral-content">
            <div className="max-w-md">
              <h1 className="mb-5 text-5xl font-bold">TraceOrigin</h1>
              <p className="mb-5">
                Hiểu về sản phẩm của bạn chưa bao giờ dễ dàng hơn với giải pháp truy xuất vòng đời sản phẩm của TraceOrigin.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="item/1"><button className="btn btn-info">Quét QR</button></Link>
                <Link to="item/1"><button className="btn btn-info">Tải ảnh QR</button></Link>
              </div>
            </div>
          </div>
        </div>
        {/* more content here */}
      </>
    );

  return (
    <main className="h-[93svh] overflow-y-auto">
      {content}
    </main>
  );
}

export default Home;
