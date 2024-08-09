import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaUpload } from 'react-icons/fa';

const FileUploadModel3D = ({ onFileUpload }) => {
  const [modelUrl, setModelUrl] = useState(null);
  const [fileName, setFileName] = useState(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      onFileUpload(file);
      setModelUrl(URL.createObjectURL(file)); // Tạo URL cho mô hình 3D
      setFileName(file.name); // Lưu tên tệp

    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.stl'
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed p-4 ${isDragActive ? 'bg-gray-200' : 'bg-gray-100'} text-center`}
    >
      <input {...getInputProps()} />
      <p>
        {isDragActive ? 'Thả tệp vào đây...' : 'Kéo và thả tệp vào đây hoặc nhấp để chọn tệp'}
      </p>
      <p className="text-gray-400 text-xs mb-4">(Tối đa 50Mb)</p>
      <FaUpload className="text-2xl mx-auto mt-2" />

      {modelUrl && (
        <div className="mt-4">
          <p className="font-semibold">Mô hình đã được tải lên:</p>
        
          <p>{fileName}</p>
          
        </div>
      )}
    </div>
  );
};

export default FileUploadModel3D;
