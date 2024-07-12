import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Input from "./UI/Input";
import Button from "./UI/Button";
import { FaCamera } from "react-icons/fa";
import { IoVideocam } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
const qrcodeRegionId = "html5qr-code-full-region";

export default function CustomUIQRCodeScanner() {
  const [listCameras, setListCameras] = useState([]);
  const [cameraId, setCameraId] = useState("");
  const html5QrCodeRef = useRef(null); // Use useRef to hold the instance
  const [choose, setChoose] = useState(0);

  const qrCodeSuccessCallback = (decodedText, decodedResult) => {
    console.log(decodedText);
    console.log("Decoded text:", decodedText);
  };

  const config = { fps: 60, qrbox: { width: 250, height: 250 } };

  const startCamera = () => {
    if (html5QrCodeRef.current && cameraId) {
      html5QrCodeRef.current
        .start(
          { deviceId: { exact: cameraId.split(",")[0] } },
          config,
          qrCodeSuccessCallback
        )
        .catch((err) => console.log("Error starting camera:", err));
    }
  };

  const stopCamera = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current
        .stop()
        .then(() => {
          console.log("Camera stopped");
        })
        .catch((err) => {
          console.log("Error stopping camera:", err);
        });
    }
  };

  useEffect(() => {
    html5QrCodeRef.current = new Html5Qrcode(qrcodeRegionId);

    return () => {
      // Ensure to clean up the scanner on component unmount
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current
          .stop()
          .catch((error) =>
            console.log("Failed to stop the QR scanner", error)
          );
      }
    };
  }, []);

  useEffect(() => {
    // Fetch cameras on component mount
    Html5Qrcode.getCameras()
      .then((devices) => {
        setListCameras(
          devices.map((device) => ({ id: device.id, content: device.label }))
        );
      })
      .catch((err) => {
        console.error("Error fetching cameras:", err);
      });
  }, []);

  return (
    <div className="min-h-40">
      <h2 className="text-2xl text-center">Quét QR</h2>
      {choose === 0 && (
        <div className="flex justify-around mt-4">
          <div
            className="bg-slate-200 border h-40 w-40 rounded-md hover:bg-slate-400 flex flex-col justify-center items-center p-4 cursor-pointer"
            onClick={() => setChoose(1)}
          >
            <FaCamera className="w-14 h-14" />
            <p className="text-center">Chọn ảnh</p>
          </div>
          <div
            className="bg-slate-200 border h-40 w-40 rounded-md hover:bg-slate-400 flex flex-col justify-center items-center p-4 cursor-pointer"
            onClick={() => setChoose(2)}
          >
            <IoVideocam className="w-14 h-14" />
            <p>Quay video</p>
          </div>
        </div>
      )}
      {choose === 2 && (
        <>
          <Button outline primary onClick={() => setChoose(0)} className="ml-2">
            <IoIosArrowBack />
            Quay lại
          </Button>
          <div className="flex justify-around items-end">
          <Input
            type="select"
            data={listCameras}
            onChange={(e) => setCameraId(e.target.value)}
            placeholder="Chọn camera"
          />
          <Button primary onClick={startCamera} rounded className='h-fit'>
            Bật camera
          </Button>
          {/* <Button primary onClick={stopCamera}>
            Stop Camera
          </Button> */}
           
          </div>
        </>
      )}
      <div id={qrcodeRegionId} className="mt-4 mb-8" />
      {choose === 1 && (
        <>
          <Button outline primary onClick={() => setChoose(0)} className="ml-2">
            <IoIosArrowBack />
            Quay lại
          </Button>
          <Input type="file" accept="image/*" capture />
        </>
      )}
    </div>
  );
}
