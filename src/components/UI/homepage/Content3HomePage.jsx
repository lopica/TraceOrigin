import { FaBrain, FaVrCardboard } from "react-icons/fa";
import ThreeDModelViewer from "../ThreeDModelViewer";

const Content3HomePage = () => {
  return (
    <div className="py-12 md:p-12">
      <div className="flex flex-col md:flex-row gap-16 max-w-6xl mx-auto">
        {/* Nửa trái: Biểu đồ */}
        <div className="md:w-1/2 flex flex-col items-center justify-center text-center">
        <iframe
        className="w-full h-full rounded-box"
              src="https://www.youtube.com/embed/D2NUurpza3U"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>

          {/* <ThreeDModelViewer/> */}
        </div>
        {/* Nửa phải: Nội dung */}
        <div className="md:w-1/2 flex flex-col items-center justify-center text-justify text-lg">
          <div className="container mx-auto px-4 py-8">
            
            <h1 className="text-xl font-semibold mb-8">
              HỆ THỐNG TRUY XUẤT NGUỒN GỐC
            </h1>
            <p className="text-lg mb-4">
              Hệ thống của chúng tôi được thiết kế để cung cấp sản phẩm minh
              bạch và tiện lợi. Truy xuất nguồn gốc đảm bảo uy tín cho các đối
              tác và người dùng, với sản phẩm đã đăng ký được đảm bảo minh bạch
              trong toàn bộ vòng đời.
            </p>

            <div className="space-y-4">
              <div className=" bg-white p-4 rounded-box shadow-md">
                <h3 className="flex items-center text-xl font-semibold">
                  <FaBrain className="mr-2 text-color1" />
                  Áp dụng công nghệ AI
                </h3>
                <p className="text-md">
                  Nhận biết hình ảnh cho ra kết quả nhanh nhất.
                </p>
              </div>

              <div className="bg-white p-4 rounded-box shadow-md">
                <h3 className="flex items-center text-xl font-semibold">
                  <FaVrCardboard className="mr-2 text-color1" />
                  Áp dụng WebXR
                </h3>
                <p className="text-md">
                  Tạo ra môi trường ảo hoàn toàn, nơi người dùng có thể tương
                  tác như trong thế giới thực.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content3HomePage;
