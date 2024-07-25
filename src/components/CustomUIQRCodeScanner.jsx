import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { FaCamera } from "react-icons/fa";
import { IoVideocam } from "react-icons/io5";
import Button from "./UI/Button";
import { IoIosArrowBack } from "react-icons/io";
import Dropzone from "./Dropzone";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateQRList } from "../store";

const QRCodeScanner = () => {
  const [qrCodeData, setQRCodeData] = useState(null);
  const qrCodeRegionId = "qr-code-region";
  const [step, setStep] = useState("choose");
  const [imageUrl, setImageUrl] = useState(null);
  const imageRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [item, setItem] = useState({
    itemId: "",
    manufacturerId: "",
    productName: "",
    manufacturerName: "",
    url: "",
  });
  const [listCamera, setListCamera] = useState([]);
  const [cameraType, setCameraType] = useState("");
  const { qrList } = useSelector((state) => state.historySearchSlice);
  const dispatch = useDispatch();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const imageSrc = URL.createObjectURL(file);
      setImageUrl(imageSrc);
      scanQRCode(file);
    } else {
      alert("Please select an image file.");
    }
  };

  const handleSuccess = (decodedText, _) => {
    console.log(decodedText);
    const url = new URL(decodedText);
    const productRecognition = url.searchParams.get("productRecognition");
    setQRCodeData(productRecognition);
    setItem((prev) => ({
      ...prev,
      itemId: productRecognition,
      url: decodedText,
    }));
    dispatch(updateQRList({ id: productRecognition, url: decodedText }));
  };

  const scanQRCode = (imageSrc) => {
    const html5QrCode = new Html5Qrcode("qr-reader");
    html5QrCode
      .scanFileV2(imageSrc, true)
      .then(({ decodedText }) => {
        handleSuccess(decodedText);
        setImageLoaded(true);
      })
      .catch((err) => {
        setQRCodeData("");
        console.error("Không quét được mã QR", err);
      });
  };

  const checkCameraAvailability = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter(
      (device) => device.kind === "videoinput"
    );
    console.log(videoInputs);
    setCameraType(videoInputs[0].id);
    setListCamera(
      videoInputs.map((device) => ({ id: device.id, label: device.label }))
    );
  };

  const handleCameraChange = (event) => {
    setCameraType(event.target.value);
  };

  useEffect(() => {
    console.log(qrList);
  }, [qrList]);

  useEffect(() => {
    async function loadCamera() {
      if (step === "video") {
        await checkCameraAvailability();
      }
    }
    loadCamera();
  }, [step]);

  useEffect(() => {
    if (step === "video") {
      const config = {
        fps: 30,
        qrbox: 200,
      };
      // Html5Qrcode.getCameras().then((devices)=>).catch(err=>console.log(err))
      const html5QrCode = new Html5Qrcode(qrCodeRegionId, config, false);

      html5QrCode.start(
        cameraType || { facingMode: "environment" },
        config,
        (decodedText, _) => {
          console.log(decodedText);
          handleSuccess(decodedText);
        }
      );
      return () => {
        html5QrCode
          .stop()
          .then((_) => {
            html5QrCode.clear().catch((error) => {
              console.error("Failed to clear html5QrCodeScanner. ", error);
            });
          })
          .catch((err) => {
            // Stop failed, handle it.
            // console.log('Không dừng được camera ' + err)
          });
      };
    }
  }, [step]);

  return (
    <section>
      <h2 className="text-center text-3xl mb-8">QR Code Scanner</h2>
      {step === "choose" && (
        <div className="flex justify-around mt-4 mx-auto max-w-2xl">
          <div
            className="bg-slate-200 border h-40 w-40 rounded-md hover:bg-slate-400 flex flex-col justify-center items-center p-4 cursor-pointer"
            onClick={() => setStep("image")}
          >
            <FaCamera className="w-14 h-14" />
            <p className="text-center">Chọn ảnh</p>
          </div>
          <div
            className="bg-slate-200 border h-40 w-40 rounded-md hover:bg-slate-400 flex flex-col justify-center items-center p-4 cursor-pointer"
            onClick={() => setStep("video")}
          >
            <IoVideocam className="w-14 h-14" />
            <p>Quay trực tiếp</p>
          </div>
        </div>
      )}
      {step === "image" && (
        <div className="mb-4">
          <Button
            primary
            outline
            onClick={() => setStep("choose")}
            className="mb-4"
          >
            <IoIosArrowBack />
            Quay lại
          </Button>
          {!imageUrl && (
            <>
              <Dropzone
                className="max-w-4xl lg:mx-auto h-[20svh] mx-2"
                setImageUrl={setImageUrl}
                scanQr={scanQRCode}
              />
              <div className="mt-8 pl-4">
                <h3 className="">Lịch sử tìm kiếm</h3>
                <ul className="pl-8 flex gap-4 mt-2">
                  {qrList.map((qr) => (
                    <Link key={qr.id} to={qr.url}>
                      <Button secondary rounded>
                        {qr.id}
                      </Button>
                    </Link>
                  ))}
                  {qrList.length === 0 && (
                    <p>Bạn chưa tìm kiếm sản phẩm nào.</p>
                  )}
                </ul>
              </div>
            </>
          )}
          {imageUrl && (
            <div className="flex">
              <div className="flex-1 flex flex-col items-center p-2">
                <img
                  src={imageUrl}
                  ref={imageRef}
                  onLoad={() => setImageLoaded(true)}
                  alt="upload image"
                  className=" h-[40svh] object-contain"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="fileInput"
                  onChange={handleFileUpload}
                />
                <p
                  className="text-center underline text-slate-500 w-full py-2 hover:cursor-pointer"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  Chọn ảnh khác
                </p>
              </div>
              <div className="flex-1 w-1/2 p-4">
                {!imageLoaded ? (
                  <p>Đang tìm kiếm...</p>
                ) : (
                  <div className="">
                    <h3 className="text-center text-3xl mb-2">
                      {/* {item.productName} */}
                      {qrCodeData}
                    </h3>
                    <div className="flex justify-between max-w-md mx-auto">
                      <div className="flex">
                        <div className="flex flex-col">
                          <div className="stat-title">Mã sản phẩm</div>
                          <div className="font-medium">
                            <Link to={item.url}>
                              <p className="hover:font-bold hover:text-sky-700">
                                {item.itemId}
                              </p>
                            </Link>
                          </div>
                        </div>
                        <div className="stat-figure text-secondary"></div>
                      </div>
                      <p className="underline cursor-pointer">
                        {item.manufacturerName}
                      </p>
                    </div>
                    <div className="mt-8">
                      <h3 className="">Lịch sử tìm kiếm</h3>
                      <ul>
                        {qrList.map((qr) => (
                          <Link key={qr.id} to={qr.url}>
                            <Button secondary>{qr.id}</Button>
                          </Link>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {step === "video" && (
        <div>
          <Button
            primary
            outline
            onClick={() => {
              setStep("choose");
            }}
            className="mb-4"
          >
            <IoIosArrowBack />
            Quay lại
          </Button>
          <div className="flex flex-col sm:flex-row pb-4">
            <div className="flex-1 max-w-full sm:max-w-[50%]">
              <div className="relative w-full bg-sky-200">
                <div id={qrCodeRegionId}></div>
              </div>
              <select
                className="mt-2 block w-full text-gray-700 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                onChange={handleCameraChange}
                value={cameraType}
              >
                {listCamera.map((camera) => (
                  <option key={camera.id}>{camera.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 max-w-full sm:max-w-[50%]">
              {item.itemId && (
                <div className="flex-1 mx-auto sm:max-w-md lg:max-w-sm">
                  <h3 className="text-center text-3xl mb-6">{qrCodeData}</h3>
                  <div className="flex justify-between gap-2 mx-2">
                    <div className="flex">
                      <div className="flex flex-col">
                        <div className="stat-title">Mã sản phẩm</div>
                        <div className="font-medium">
                          <Link to={item.url}>
                            <p className="hover:font-bold hover:text-sky-700">
                              {item.itemId}
                            </p>
                          </Link>
                        </div>
                      </div>
                      <div className="stat-figure text-secondary"></div>
                    </div>
                    <p className="underline cursor-pointer">
                      {item.manufacturerName}
                    </p>
                  </div>
                </div>
              )}
              <div className="mt-8 pl-4">
                <h3 className="">Lịch sử tìm kiếm</h3>
                <ul className="pl-8 flex gap-4 mt-2">
                  {qrList.map((qr) => (
                    <Link key={qr.id} to={qr.url}>
                      <Button secondary rounded>
                        {qr.id}
                      </Button>
                    </Link>
                  ))}
                  {qrList.length === 0 && (
                    <p>Bạn chưa tìm kiếm sản phẩm nào.</p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      <div id="qr-reader" style={{ display: "none" }}></div>
    </section>
  );
};

export default QRCodeScanner;
