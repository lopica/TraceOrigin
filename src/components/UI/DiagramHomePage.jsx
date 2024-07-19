import ChartHomePage from "./ChartHomePage";
import { useGetNumberVisitsAllTimeQuery } from '../../store/apis/elkApi';

const DiagramHomePage = () => {
  const { data: number } = useGetNumberVisitsAllTimeQuery();

  return (
    <div>
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto p-24">
        {/* Nửa trái: Nội dung */}
        <div className="md:w-1/2 p-4 flex flex-col items-center justify-center text-center">
          <div className="font-bold">
            <div>Số lượt người dùng sử dụng</div>
            <img
              src="/logo_full.png" // Đường dẫn tới logo của bạn
              alt="Logo"
              className="my-4 mx-auto max-w-[150px]" // Điều chỉnh kích thước logo
            />
            <div>để truy xuất nguồn gốc</div>
          </div>
          <div className="text-5xl font-extrabold text-blue-600">
            {number}
          </div>
        </div>
        {/* Nửa phải: Biểu đồ */}
        <div className="md:w-1/2 p-4">
          <ChartHomePage />
        </div>
      </div>
    </div>
  );
};

export default DiagramHomePage;
