const DiagramHomePage = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto p-6">
        {/* Nửa trái: Nội dung */}
        <div className="md:w-1/2 p-4 flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl font-bold mb-4">Số lần người dùng truy xuất nguồn gốc</h2>
          <div className="text-5xl font-extrabold text-blue-600">
          121223
        </div>
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
