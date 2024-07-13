const DiagramHomePage = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto p-6">
        {/* Nửa trái: Nội dung */}
        <div className="md:w-1/2 p-4 flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl font-bold mb-4">Số người sử dụng ứng dụng</h2>
          <p className="text-lg mb-6">
            Hơn 10.000 người đã tin tưởng sử dụng ứng dụng của chúng tôi để truy
            xuất nguồn gốc.
          </p>
          <a
            href="/signup"
            className="mt-6 bg-blue-600 text-white py-2 px-4 rounded"
          >
            Tham gia ngay
          </a>
        </div>
        {/* Nửa phải: Biểu đồ */}
        <div className="md:w-1/2 p-4">
          <img
            src="https://img.freepik.com/free-vector/illustration-data-analysis-graph_53876-17902.jpg"
            alt="Data Analysis Graph"
          />
        </div>
      </div>
    </div>
  );
};

export default DiagramHomePage;
