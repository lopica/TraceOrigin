import { FaBrain } from "react-icons/fa";
import { SiBlockchaindotcom } from "react-icons/si";

const Content3HomePage = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto ">
        {/* Nửa trái:  Biểu đồ */}
        <div className="md:w-1/2 flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl font-bold mb-4">
            <img
              className="rounded-lg object-cover"
              src="/qr1.png"
              alt="Data Analysis Graph"
            />
          </h2>
        </div>
        {/* Nửa phải: Nội dung */}
        <div className="md:w-1/2 p-4 flex flex-col items-center justify-center  text-justify text-lg">
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-blue-600 text-2xl font-bold mb-4">
              Giới thiệu
            </h2>
            <h1 className="text-2xl font-semibold mb-2">
              Truy xuất nguồn gốc TRACE ORIGIN
            </h1>
            <p className="text-lg mb-4">
              Hệ thống của chúng tôi được thiết kế để cung cấp sản phẩm minh
              bạch và tiện lợi. Truy xuất nguồn gốc đảm bảo uy tín cho các đối
              tác và người dùng, với sản phẩm đã đăng ký được đảm bảo minh bạch
              trong toàn bộ vòng đời.
            </p>

            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded shadow">
                <h3 className="flex items-center text-xl font-semibold">
                  <FaBrain className="mr-2 text-blue-500" />
                  Áp dụng công nghệ AI
                </h3>
                <p className="text-md">
                  Nhận biết hình ảnh cho ra kết quả nhanh nhất.
                </p>
              </div>

              <div className="bg-gray-100 p-4 rounded shadow">
                <h3 className="flex items-center text-xl font-semibold">
                  <SiBlockchaindotcom className="mr-2 text-blue-500" />
                  Áp dụng công nghệ Blockchain
                </h3>
                <p className="text-md">
                  Trên nền tảng mã hóa làm tăng độ công khai minh bạch của sản
                  phẩm.
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
