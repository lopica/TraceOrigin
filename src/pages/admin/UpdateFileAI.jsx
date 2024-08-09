import CarouselModal from "../../components/UI/CarouselModal";
import React, { useEffect, useState } from "react";
import { useSaveFileAIMutation } from "../../store/apis/productApi";
import useToast from "../../hooks/use-toast";
import { useGetHistoryUploadAIQuery } from "../../store/apis/elkApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function UpdateFileAI() {
  const [saveFileAI] = useSaveFileAIMutation();
  const [weights, setWeights] = useState(null);
  const [classNames, setClassNames] = useState(null);
  const [model, setModel] = useState(null);
  const [description, setDescription] = useState("");
  const [dataHistory, setDataHistory] = useState([]);

  const { getToast } = useToast();
  
  // ========================================== fetch history
  const { data: apiData, refetch } =
  useGetHistoryUploadAIQuery( {
    skip: true,
  });

  useEffect(() => {
    if(apiData){
      setDataHistory(JSON.parse(apiData));
    }
  }, [apiData]);
  // ============================ handle file change
  const handleFileChange = (event) => {
    const { name, files } = event.target;
    if (files.length > 0) {
      switch (name) {
        case "weights":
          setWeights(files[0]);
          break;
        case "classNames":
          setClassNames(event.target.files[0]);
          break;
        case "model":
          setModel(event.target.files[0]);
          break;
        default:
          break;
      }
    }
  };

  // ============================ handle submit
  const handleSubmit = async (event) => {
    getToast("Đang upload file lên hệ thống...");

    event.preventDefault();

    const formData = {
      weights,
      classNames,
      model,
      description,
    };
   try {
      await saveFileAI(formData).unwrap();
      getToast("Upload file thành công");
    } catch (error) {
      console.error("Update failed:", error);
      getToast("Đã xảy ra lỗi");
    }
    refetch();
  };

  // ============================ handle parse
  const parseMessage = (message) => {
    const parts = message.split("/");
    return parts[parts.length - 1];
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
  
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };
    // =============================== handle logout
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.authSlice);
  
    useEffect(() => {
      if (!isAuthenticated) {
        getToast("Phiên đăng nhập đã hết hạn");
        navigate("/portal/login");
      }
    }, [isAuthenticated, getToast, navigate]);
    // ===============================
  return (
    <div className="flex flex-col md:flex-row p-4">
      <div className="md:w-1/3 p-4">
        {/* =================================================================== form upload file  */}
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Tải tệp lên</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Weights (bin file):
                <input
                  type="file"
                  name="weights"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Class Names (json file):
                <input
                  type="file"
                  accept=".json"
                  name="classNames"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Model (json file):
                <input
                  type="file"
                  accept=".json"
                  name="model"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </label>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Mô tả:
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  className="mt-1 block w-full text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </label>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Gửi
            </button>
          </form>
        </div>
        {/* =================================================================== */}
      </div>
      {/* ====================================== history  */}
      <div className="md:w-3/4 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Lịch sử cập nhật</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Thời gian</th>
                <th className="py-2 px-4 border-b">Mô tả</th>
              </tr>
            </thead>
            <tbody>
              {dataHistory.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">{formatTimestamp(item.timestamp)}</td>
                  <td className="py-2 px-4 border-b">
                    {parseMessage(item.message)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UpdateFileAI;
