import { useState, useEffect, useCallback } from "react";
import FileUploadModel3D from "./FileUploadModel3D";

const UploadModel3DModal = ({ isOpen, onClose, onSubmit }) => {

  if (!isOpen) return null;
  const [modelFile, setModelFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(modelFile);
    onClose();
  };
  const handleFileUpload = (file) => {
    setModelFile(file);
    // onSubmit(file);
    // console.log('File uploaded:', file);
  };
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-xl mb-4">Upload model 3D</h2>
        <FileUploadModel3D onFileUpload={handleFileUpload} />
      {/* {modelFile && <ModelViewer modelFile={modelFile} />} */}
        <div className="w-full flex justify-end mt-4">
        <button
        onClick={handleSubmit}
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Gửi
        </button>
      </div>
      </div>
    </div>
  );
};

export default UploadModel3DModal;
