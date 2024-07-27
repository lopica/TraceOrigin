import { FaBrain } from "react-icons/fa";
import { SiBlockchaindotcom } from "react-icons/si";

const Content3HomePage = () => {
  return (
    <div className="py-12 md:p-24">
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto">
        {/* Nửa trái: Biểu đồ */}
        <div className="md:w-1/3 flex flex-col items-center justify-center text-center">
          <img
            className="object-contain h-full w-auto"
            src="/phone_homepage.png"
            alt="Data Analysis Graph"
          />
        </div>
        {/* Nửa phải: Nội dung */}
        <div className="md:w-2/3 flex flex-col items-center justify-center text-justify text-lg">
          <div className="container mx-auto px-4 py-8">
            <img 
              src="/logo_full.png" // Đường dẫn tới logo của hãng
              alt="Logo"
              className="h-20 w-auto object-contain" // Điều chỉnh kích thước logo theo ý muốn
            />
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
                  <SiBlockchaindotcom className="mr-2 text-color1" />
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
