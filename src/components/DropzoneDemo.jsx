import { memo, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { twMerge } from "tailwind-merge";
import { RiFolderUploadFill } from "react-icons/ri";
import axios from "axios";

function DropzoneDemo({ className, setImageUrl, scanQr,setProductId,setConfidence,setImageLoaded }) {
  // const [predictionResult, setPredictionResult] = useState("");
  // const [confidence, setConfidence] = useState(0);
  // const [imageLoaded, setImageLoaded] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    console.log("File dropped");
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const url = URL.createObjectURL(file);
      setImageUrl(url);

      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post("https://traceorigin-ai.click/upload", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const productId = response.data.productName;
        setProductId(productId);
        setConfidence(response.data.confidence);
        setImageLoaded(true);
      } catch (error) {
        console.error("Error uploading file", error);
      }
    } else {
      alert("Please select a valid image file.");
    }
  }, [setImageUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/svg+xml': ['.svg']
    },
    maxFiles: 1,
    multiple: false,
  });

  const classes = twMerge(
    "border border-2 border-dashed border-slate-400 bg-slate-50 text-center p-4 flex flex-col justify-center items-center cursor-pointer hover:bg-slate-200 hover:border-slate-500 transition-all duration-100",
    className
  );

  return (
    <div {...getRootProps()} className={classes}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <></>
      ) : (
        <>
          <RiFolderUploadFill className="w-14 h-14 mb-2" />
          <p>Tải ảnh của bạn lên ở đây</p>
        </>
      )}
    </div>
  );
}

export default memo(DropzoneDemo);
