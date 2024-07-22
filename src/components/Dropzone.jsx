import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { twMerge } from "tailwind-merge";
import { RiFolderUploadFill } from "react-icons/ri";

function Dropzone({ className, setImageUrl, scanQr }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      scanQr && scanQr(file)
    }
  }, []);

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

export default Dropzone;
