import ChartHomePage from "./ChartHomePage";

const DiagramHomePage = () => {
  return (
    <div className="p-2 md:p-24">
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto p-16">
        {/* Nửa trái: Nội dung */}
        <div className="md:w-1/2 flex flex-col items-center justify-center text-center text-xl">
          <div className="font-bold">
            <div>Số lượt người dùng sử dụng</div>
            <img
              src="/logo_full.png" // Đường dẫn tới logo của bạn
              alt="Logo"
              className="my-4 mx-auto max-w-[150px]" // Điều chỉnh kích thước logo
            />
            <div>để truy xuất nguồn gốc trong ngày</div>
          </div>
        </div>
        {/* Nửa phải: Biểu đồ */}
        <div className="md:w-1/2 flex items-center justify-center">
          <div className="w-full aspect-w-16 aspect-h-9">
            <ChartHomePage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagramHomePage;
