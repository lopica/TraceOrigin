import ChartHomePage from "./ChartHomePage";

const DiagramHomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:p-24">
    {/* Tên nội dung */}
    <h2 className="text-md md:text-xl font-bold text-center">
    Số lượt người dùng truy xuất nguồn gốc trong ngày
    </h2>
    <div className="w-full aspect-w-16 aspect-h-9">
            <ChartHomePage />
          </div>
  </div>
  );
};

export default DiagramHomePage;
