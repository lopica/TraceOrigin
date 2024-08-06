import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaUpload } from 'react-icons/fa';
import ModelViewer from './ModelViewer';

const FileUploadModel3D = ({ onFileUpload }) => {
  const [modelUrl, setModelUrl] = useState(null);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };


  return (
    <div>
          <input type="file" accept=".stl" onChange={handleFileChange} />
    </div>
  );
};

export default FileUploadModel3D;
